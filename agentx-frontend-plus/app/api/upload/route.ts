import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${Date.now()}-${file.name}`;
        const uploadDir = path.join(process.cwd(), 'public/uploads');
        const filePath = path.join(uploadDir, filename);

        // Ensure the uploads directory exists
        await import('fs').then(fs => {
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
        });

        await writeFile(filePath, buffer);

        const fileUrl = `/uploads/${filename}`;
        return NextResponse.json({ url: fileUrl, filename: file.name }, { status: 200 });
    } catch (error) {
        console.error('File upload error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
} 