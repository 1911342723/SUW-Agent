"use client"

import { useEffect, useState } from "react"
import { Bot, Search, Plus, Check } from "lucide-react"
import { Metadata } from "next"
import { redirect, useRouter } from "next/navigation"
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/hooks/use-toast"
import { getPublishedAgents, addAgentToWorkspaceWithToast } from "@/lib/agent-service"
import type { AgentVersion } from "@/types/agent"
import { Sidebar } from "@/components/sidebar"
import Link from "next/link"

export default function ExplorePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [agents, setAgents] = useState<AgentVersion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("推荐")
  const [addingAgentId, setAddingAgentId] = useState<string | null>(null)
  const [textScale, setTextScale] = useState('scale-105'); // Initial scale for animation

  useEffect(() => {
    // After component mounts, trigger the shrink animation
    const timer = setTimeout(() => {
      setTextScale('scale-100'); // Shrink to normal size
    }, 100); // Small delay to ensure initial render with scale-105

    return () => clearTimeout(timer);
  }, []);

  // 防抖处理搜索查询
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // 获取已发布的助理列表
  const fetchAgents = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await getPublishedAgents(debouncedQuery)

      if (response.code === 200) {
        setAgents(response.data)
      } else {
        setError(response.message)
        toast({
          title: "获取助理列表失败",
          description: response.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "未知错误"
      setError(errorMessage)
      toast({
        title: "获取助理列表失败",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAgents()
  }, [debouncedQuery])

  // 处理添加助理到工作区
  const handleAddToWorkspace = async (agentId: string) => {
    try {
      setAddingAgentId(agentId)
      const response = await addAgentToWorkspaceWithToast(agentId)
      if (response.code === 200) {
        // 局部刷新列表，而不是跳转到首页
        await fetchAgents()
      }
    } catch (error) {
      // 错误已由withToast处理
      console.error("添加助理到工作区失败:", error)
    } finally {
      setAddingAgentId(null)
    }
  }

  // 根据类型过滤助理
  const getFilteredAgents = (tab: string) => {
    if (tab === "推荐") return agents

    // 将标签名称映射到 agentType 或其他属性
    return agents.filter((agent) => {
      if (tab === "Agent" && agent.agentType === 2) return true
      if (tab === "助手" && agent.agentType === 1) return true
      // 其他标签可以根据需要添加更多过滤条件
      return false
    })
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-full">
      {/* 左侧边栏 */}
      <Sidebar />

      {/* 右侧内容区域 */}
      <div className="flex-1 relative flex items-center justify-center">
        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
          <DotLottieReact
            src="https://lottie.host/e7d5c625-5ac5-486b-9647-3af2b5847e08/ADgpunue9O.lottie"
            loop
            autoplay
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 text-center py-20">
          {/* 文字部分保持上移300px */}
          <div className="-mt-[300px]">
            <h1 className={`text-4xl font-extrabold tracking-tight lg:text-5xl text-gray-900 mb-4 transition-transform duration-700 ease-out leading-relaxed ${textScale}`}>
              欢迎访问SWU人工智能代理平台
            </h1>
            <p className={`text-xl text-gray-600 mb-8 transition-transform duration-700 ease-out leading-relaxed ${textScale}`}>
              开始创建你的超级智能体
            </p>
          </div>

          {/* 增加按钮的mt值 */}
          <Link href="/studio" passHref>
            <Button className="mt-[200px] px-8 py-3 text-lg font-semibold rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 bg-blue-600 hover:bg-blue-700 text-white">
              开始创建
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

