import type React from "react"
import { Providers } from "./providers"
import { ThemeProvider } from "@/components/theme-provider"
import "@/styles/globals.css"
import { StageWiseToolbarWrapper } from "@/components/stagewise-toolbar"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <title>SUW-Agent</title>
        <meta name="description" content="您的全方位 AI 代理平台" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Providers>{children}</Providers>
          <StageWiseToolbarWrapper />
        </ThemeProvider>
      </body>
    </html>
  )
}

