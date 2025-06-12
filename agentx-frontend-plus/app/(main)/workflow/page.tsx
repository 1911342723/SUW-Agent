"use client"
import { useState } from "react";
import { XCircle, Cog } from "lucide-react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

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
        <div className="w-full h-[calc(100vh-3.5rem)] relative flex items-center justify-center overflow-hidden">
            {/* 背景动画容器 */}
            <div className="absolute inset-0 w-full h-full flex items-center justify-center z-0 opacity-50">
                <DotLottieReact
                    src="https://lottie.host/8142efa0-e154-49b6-bddc-c446a5c23b0d/mtxH9SNZdd.lottie"
                    loop
                    autoplay
                    className="w-full h-full object-cover"
                />
            </div>

            {/* 主内容 */}
            <div className="relative z-10 text-center max-w-2xl mx-auto space-y-32">
                <h1 className="text-5xl sm:text-6xl text-gray-900 font-extrabold animate-float mt-[-100px]">
                    万物实现自动化
                </h1>

                <div className="mt-32">
                    <button
                        onClick={handleOpenN8N}
                        className="px-12 py-5 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105 text-xl font-semibold"
                    >
                        点击打开工作流平台
                    </button>
                </div>

                {hasError && (
                    <div className="mt-12 bg-red-50/90 border-l-4 border-red-400 text-red-700 p-4 rounded-md shadow-md flex items-center space-x-3">
                        <XCircle className="h-8 w-8 flex-shrink-0" />
                        <div>
                            <p className="font-bold text-xl">打开失败！</p>
                            <p className="text-base mt-2">
                                请确保 n8n 服务正在运行（访问 <a href={n8nUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">{n8nUrl}</a>）<br />
                                请允许浏览器弹出窗口<br />
                                请检查控制台错误日志
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {isOpening && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-800">正在打开工作流平台...</p>
                    </div>
                </div>
            )}
        </div>
    );
}