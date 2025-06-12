"use client"
import { useEffect, useState } from "react"

export default function WorkflowPage() {
    const [iframeLoaded, setIframeLoaded] = useState(false)
    const [hasError, setHasError] = useState(false)

    // 使用 Nginx 代理
    const n8nUrl = 'http://localhost:9000';

    // 处理 iframe 加载状态
    const handleIframeLoad = () => {
        setIframeLoaded(true)
        setHasError(false)

        // 额外检查：iframe 内容是否正确加载
        try {
            const iframe = document.querySelector('iframe');
            if (iframe && iframe.contentDocument && !iframe.contentDocument.title.includes('n8n')) {
                throw new Error('Unexpected page content');
            }
        } catch (error) {
            handleIframeError();
        }
    }

    const handleIframeError = () => {
        setHasError(true)
        setIframeLoaded(false)
    }

    return (
        <div className="w-full h-[calc(100vh-3.5rem)] relative">
            {!iframeLoaded && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
                    {!hasError ? (
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                            <p className="text-gray-600">正在加载 n8n 工作流界面...</p>
                        </div>
                    ) : (
                        <div className="text-center p-4 max-w-md">
                            <h2 className="text-xl font-semibold text-red-600 mb-2">无法加载 n8n 工作流</h2>
                            <p className="text-gray-600 mb-4">
                                请确保 n8n Docker 服务正在运行
                            </p>
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-left">
                                <p className="text-sm text-yellow-700">
                                    <strong>检查步骤：</strong><br />
                                    1. 运行: docker ps | grep n8n<br />
                                    2. 检查 Docker 状态: docker inspect n8n<br />
                                    3. 查看日志: docker logs n8n<br />
                                    4. 尝试直接访问: <a href={n8nUrl} target="_blank" rel="noopener noreferrer"
                                        className="text-blue-600 underline">{n8nUrl}</a>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <iframe
                src={n8nUrl}
                className={`w-full h-full border-0 ${!iframeLoaded ? 'invisible' : ''}`}
                title="N8N Workflow"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                allow="fullscreen *; camera *; microphone *; clipboard-read *; clipboard-write *"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation allow-modals allow-downloads"
                referrerPolicy="strict-origin-when-cross-origin"
            />
        </div>
    )
}