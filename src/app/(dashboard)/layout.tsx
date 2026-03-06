import { MainSidebar } from "@/components/main-sidebar"
import { UserNav } from "@/components/user-nav"
import { NotificationsNav } from "@/components/notifications-nav"
import { NewsTicker } from "@/components/news-ticker"
import { NetworkStatus } from "@/components/network-status"
import { Separator } from "@/components/ui/separator"
import { Search } from "lucide-react"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen flex-col overflow-hidden bg-background text-foreground">
            <div className="border-b shrink-0 bg-white text-foreground">
                <div className="flex h-14 items-center px-6">
                    {/* News Ticker aligned to the left */}
                    <div className="flex-1 flex justify-start overflow-hidden h-full">
                        <NewsTicker />
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center space-x-6 shrink-0 ml-4">
                        <NetworkStatus />
                        <NotificationsNav />
                        <Separator orientation="vertical" className="h-5 opacity-40 bg-slate-300" />
                        <UserNav />
                    </div>
                </div>
            </div>
            <div className="flex-1 flex overflow-hidden">
                <MainSidebar />
                <main
                    className="flex-1 flex flex-col min-w-0 bg-white text-black overflow-y-auto custom-scrollbar"
                    style={
                        {
                            "--background": "oklch(1 0 0)",
                            "--foreground": "oklch(0 0 0)",
                            "--border": "oklch(0 0 0)",
                            "--input": "oklch(0 0 0)",
                            "--ring": "oklch(0 0 0)",
                            "--muted": "oklch(0.95 0 0)",
                            "--muted-foreground": "oklch(0.2 0 0)",
                        } as React.CSSProperties
                    }
                >
                    {children}
                </main>
            </div>
        </div>
    )
}
