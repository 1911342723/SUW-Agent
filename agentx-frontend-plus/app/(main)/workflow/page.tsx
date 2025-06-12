"use client"
import { useState } from "react";

export default function WorkflowPage() {
    const [isOpening, setIsOpening] = useState(false);
    const [hasError, setHasError] = useState(false);
    const n8nUrl = 'http://localhost:5678';

    const handleOpenN8N = () => {
        setIsOpening(true);
        setHasError(false);
        
        try {
            // 计算窗口尺寸（全屏宽度，80%高度）
            const windowWidth = window.screen.width;
            const windowHeight = window.screen.height * 0.77;
            const left = 0;  // 左侧对齐屏幕边缘
            const top = window.screen.height - windowHeight;  // 贴紧底部

            // 窗口特性配置（隐藏所有浏览器控件）
            const features = [
                `width=${windowWidth}`,
                `height=${windowHeight}`,
                `left=${left}`,
                `top=${top}`,
                'menubar=no',
                'toolbar=no',
                'location=no',
                'status=no',
                'resizable=yes',
                'scrollbars=yes'
            ].join(',');

            const newWindow = window.open(n8nUrl, '_blank', features);
            
            if (!newWindow) {
                throw new Error('弹窗被浏览器阻止，请允许弹出窗口');
            }

            // 监听窗口关闭
            const timer = setInterval(() => {
                if (newWindow.closed) {
                    clearInterval(timer);
                    setIsOpening(false);
                }
            }, 1000);
            
        } catch (error) {
            setHasError(true);
            setIsOpening(false);
            console.error('打开窗口失败:', error);
        }
    };

    return (
        <div className="w-full h-[calc(100vh-3.5rem)] flex items-center justify-center bg-gray-50">
            {!isOpening ? (
                <div className="text-center p-6 max-w-md">
                    <button
                        onClick={handleOpenN8N}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                        点击打开工作流平台
                    </button>
                    
                    {hasError && (
                        <div className="mt-4 text-left bg-yellow-50 border-l-4 border-yellow-400 p-4">
                            <p className="text-sm text-yellow-700">
                                <strong>打开失败！</strong><br />
                                1. 请确保 n8n 服务正在运行（访问 <a href={n8nUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{n8nUrl}</a>）<br />
                                2. 允许浏览器弹出窗口<br />
                                3. 检查控制台错误日志
                            </p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">正在打开 n8n 工作流平台...</p>
                </div>
            )}
        </div>
    );
}