import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload, Trash } from "lucide-react";

interface FileUploadProps {
  variant?: 'default' | 'avatar';
  size?: 'sm' | 'md' | 'lg';
  value?: string | null;
  onChange?: (url: string | null) => void;
  placeholder?: React.ReactNode;
  uploadText?: string;
  changeText?: string;
  removeText?: string;
  maxSize?: number;
  accept?: string;
  onUploadComplete?: (result: any) => void;
  onUploadError?: (error: any) => void;
  onFileSelected?: (file: File) => void;
  label?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  variant = 'default',
  size = 'md',
  value,
  onChange,
  placeholder,
  uploadText = 'Upload',
  changeText = 'Change',
  removeText = 'Remove',
  maxSize = 5 * 1024 * 1024, // 5MB default
  accept,
  onUploadComplete,
  onUploadError,
  onFileSelected,
  label
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];

    // Size validation
    if (maxSize && file.size > maxSize) {
      onUploadError?.({ message: `File size exceeds the limit of ${maxSize / (1024 * 1024)}MB` });
      return;
    }

    // If onFileSelected is provided, use that instead of automatic upload
    if (onFileSelected) {
      onFileSelected(file);
      return;
    }

    setIsUploading(true);

    try {
      // Create form data for upload
      const formData = new FormData();
      formData.append('file', file);

      // Upload to server
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorBody}`);
      }

      const result = await response.json();

      // Call onChange with the URL from the result
      if (onChange && result.url) {
        onChange(result.url);
      }

      onUploadComplete?.(result);
    } catch (error) {
      console.error('Upload error:', error);
      onUploadError?.(error);
    } finally {
      setIsUploading(false);
    }
  }, [onChange, onUploadComplete, onUploadError, onFileSelected, maxSize]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept ? {
      [accept.includes('/') ? accept : `image/${accept}`]: []
    } : undefined,
    multiple: false,
    disabled: isUploading
  });

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onChange) {
      onChange(null);
    }
  };

  // Avatar variant
  if (variant === 'avatar') {
    const sizeClass = {
      sm: 'h-16 w-16',
      md: 'h-20 w-20',
      lg: 'h-24 w-24'
    }[size];

    return (
      <div className="flex flex-col items-center gap-2">
        <div
          {...getRootProps()}
          className={`relative ${sizeClass} rounded-full overflow-hidden cursor-pointer border-2 ${isDragActive ? 'border-blue-500' : value ? 'border-transparent' : 'border-dashed border-gray-300'}`}
        >
          <input {...getInputProps()} />
          {value ? (
            <Avatar className={`${sizeClass} bg-gray-100`}>
              <AvatarImage src={value} alt="Avatar" />
              <AvatarFallback>{placeholder}</AvatarFallback>
            </Avatar>
          ) : (
            <div className={`${sizeClass} bg-gray-100 flex items-center justify-center text-gray-400`}>
              {placeholder || <Upload className="h-6 w-6" />}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isUploading}
            {...getRootProps()}
          >
            {isUploading ? 'Uploading...' : value ? changeText : uploadText}
            <input {...getInputProps()} />
          </Button>

          {value && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemove}
            >
              <Trash className="h-4 w-4 mr-1" />
              {removeText}
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
    >
      <input {...getInputProps()} />
      {isUploading ? (
        <p className="text-blue-500">Uploading...</p>
      ) : isDragActive ? (
        <p className="text-blue-500">Drop the file here...</p>
      ) : (
        <div>
          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
          <p className="text-gray-600">{label || uploadText || 'Drag & drop a file here, or click to select'}</p>
          {accept && (
            <p className="text-sm text-gray-500 mt-2">
              Supported formats: {accept}
            </p>
          )}
          {maxSize && (
            <p className="text-sm text-gray-500 mt-1">
              Max size: {maxSize / (1024 * 1024)}MB
            </p>
          )}
        </div>
      )}

      {value && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <p className="text-sm text-gray-600 truncate max-w-[200px]">{value.split('/').pop()}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRemove}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;