"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Database, FileText, Home, Menu, Search, Settings, PenToolIcon as Tool, UploadCloud, LogOut, Wrench, GitBranch } from "lucide-react"
import { toast } from "@/hooks/use-toast"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { deleteCookie } from "@/lib/utils"

const navItems = [
  {
    name: "首页",
    href: "/",
    icon: Home,
  },
  {
    name: "智能体创建",
    href: "/studio",
    icon: Tool,
  },
  {
    name: "知识库",
    href: "/knowledge",
    icon: Database,
  },
  {
    name: "MCP工具",
    href: "/tools",
    icon: Wrench,
  },
  {
    name: "工作流",
    href: "/workflow",
    icon: GitBranch,
  },
]

export function NavigationBar() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  // Check if current path matches the menu item's href
  const isActiveRoute = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  const handleLogout = () => {
    // 清除localStorage中的token
    localStorage.removeItem("auth_token")

    // 清除cookie中的token
    deleteCookie("token")

    // 显示退出成功提示
    toast({
      title: "成功",
      description: "退出登录成功"
    })

    // 跳转到登录页
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <div className="px-7">
              <Link href="/" className="flex items-center" onClick={() => setOpen(false)}>
                <Home className="mr-2 h-5 w-5 text-blue-600" />
                <span className="font-bold">SWU-Agent</span>
              </Link>
            </div>
            <nav className="mt-6 flex flex-col gap-4 px-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                    isActiveRoute(item.href) ? "bg-accent text-accent-foreground" : "transparent",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="/" className="mr-6 flex items-center">
          <span className="font-bold text-sm md:text-base lg:text-lg">SWU人工智能代理平台</span>
        </Link>
        <div className="flex flex-1 items-center justify-between">
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1 text-sm font-medium transition-colors",
                  isActiveRoute(item.href)
                    ? "text-blue-600 font-semibold"
                    : "text-foreground/60 hover:text-foreground/80",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="hidden lg:inline">{item.name}</span>
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                    <AvatarFallback>X</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                    <AvatarFallback>X</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">Yan</div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings/profile">
                    <Settings className="mr-2 h-4 w-4" />
                    个人设置
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings/general">
                    <Settings className="mr-2 h-4 w-4" />
                    通用设置
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings/billing">
                    <Settings className="mr-2 h-4 w-4" />
                    账单与用量
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings/api-keys">
                    <Settings className="mr-2 h-4 w-4" />
                    API 密钥管理
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings/providers">
                    <Settings className="mr-2 h-4 w-4" />
                    服务提供商
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleLogout}>
                  <UploadCloud className="mr-2 h-4 w-4" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}