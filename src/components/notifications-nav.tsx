"use client"

import * as React from "react"
import { Bell, Check, Clock, User, FileText, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { getLiveActivity } from "@/app/actions/activity"
import { formatDistanceToNow } from "date-fns"

export function NotificationsNav() {
    const [notifications, setNotifications] = React.useState<any[]>([])
    const [isLoading, setIsLoading] = React.useState(true)

    const fetchActivity = async () => {
        const data = await getLiveActivity(8)
        setNotifications(data)
        setIsLoading(false)
    }

    React.useEffect(() => {
        fetchActivity()
        // Poll every 15 seconds for real-time updates
        const interval = setInterval(fetchActivity, 15000)
        return () => clearInterval(interval)
    }, [])

    const unreadCount = notifications.filter(n => n.unread).length

    const getIconData = (type: string) => {
        switch (type) {
            case 'patient':
                return { icon: User, color: "text-blue-500", bg: "bg-blue-50" }
            case 'return':
                return { icon: RefreshCw, color: "text-amber-500", bg: "bg-amber-50" }
            default:
                return { icon: FileText, color: "text-green-500", bg: "bg-green-50" }
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative group">
                    <Bell className="h-5 w-5 text-gray-400 group-hover:text-amber-600 transition-colors" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500 border border-white"></span>
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[340px] bg-white p-0 shadow-2xl border-slate-100 rounded-2xl overflow-hidden focus:outline-none" align="end" forceMount>
                <div className="p-4 border-b flex items-center justify-between bg-slate-50/50">
                    <div className="flex flex-col">
                        <h2 className="font-extrabold text-slate-800 tracking-tight leading-none">Notifications</h2>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Live Updates</span>
                    </div>
                    {unreadCount > 0 && (
                        <span className="text-[10px] font-black uppercase text-amber-600 bg-white border border-amber-100 shadow-sm px-2 py-0.5 rounded-full">
                            {unreadCount} New
                        </span>
                    )}
                </div>
                <div className="max-h-[420px] overflow-y-auto custom-scrollbar">
                    {isLoading ? (
                        <div className="p-10 flex flex-col items-center justify-center gap-2 opacity-50">
                            <div className="h-4 w-4 rounded-full border-2 border-slate-200 border-t-amber-500 animate-spin" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing...</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="p-20 text-center flex flex-col items-center justify-center opacity-40">
                            < Bell className="h-8 w-8 text-slate-200 mb-2" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">No Notifications</p>
                        </div>
                    ) : (
                        notifications.map((n, i) => {
                            const { icon: Icon, color, bg } = getIconData(n.type)
                            return (
                                <React.Fragment key={n.id}>
                                    <DropdownMenuItem className="p-4 flex gap-4 cursor-pointer focus:bg-slate-50/80 transition-all rounded-none outline-none group border-l-4 border-l-transparent focus:border-l-amber-500">
                                        <div className={cn("shrink-0 h-10 w-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", bg)}>
                                            <Icon className={cn("h-5 w-5", color)} />
                                        </div>
                                        <div className="flex-1 space-y-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className={cn("text-xs font-black leading-tight truncate", n.unread ? "text-slate-900" : "text-slate-500")}>
                                                    {n.title}
                                                </p>
                                                <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold shrink-0 uppercase tracking-tighter bg-slate-100/50 px-1.5 py-0.5 rounded">
                                                    {formatDistanceToNow(new Date(n.time), { addSuffix: true })}
                                                </div>
                                            </div>
                                            <p className="text-[11px] text-slate-500 leading-normal font-semibold line-clamp-2">
                                                {n.description}
                                            </p>
                                        </div>
                                        {n.unread && (
                                            <div className="h-2 w-2 rounded-full bg-amber-500 shrink-0 self-center shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                                        )}
                                    </DropdownMenuItem>
                                    {i < notifications.length - 1 && <DropdownMenuSeparator className="m-0 bg-slate-50" />}
                                </React.Fragment>
                            )
                        })
                    )}
                </div>
                <div className="p-3 border-t bg-slate-50/50 text-center">
                    <button
                        onClick={() => setNotifications(prev => prev.map(n => ({ ...n, unread: false })))}
                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-amber-600 transition-colors py-1 group inline-flex items-center gap-2"
                    >
                        Mark all as read
                        <Check className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
