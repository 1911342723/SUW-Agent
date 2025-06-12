import { Metadata } from "next"

export const metadata: Metadata = {
    title: "工作流 | AgentX",
    description: "管理和编辑您的自动化工作流",
}

export default function WorkflowLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex-1">
            {children}
        </div>
    )
}