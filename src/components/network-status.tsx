"use client"

import * as React from "react"
import { checkNetworkStatus } from "@/app/actions/network"
import { Globe, Server, Activity, ArrowUpRight, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function NetworkStatus() {
    const [statuses, setStatuses] = React.useState<any[]>([])
    const [isLoading, setIsLoading] = React.useState(true)

    const fetchStatus = async () => {
        const results = await checkNetworkStatus()
        setStatuses(results)
        setIsLoading(false)
    }

    React.useEffect(() => {
        fetchStatus()
        const interval = setInterval(fetchStatus, 60 * 1000) // Recheck every minute
        return () => clearInterval(interval)
    }, [])

    if (isLoading) {
        return (
            <div className="flex items-center gap-3 animate-pulse px-4 border-l border-slate-100 ml-4 h-8 opacity-40">
                <div className="h-3 w-16 bg-slate-100 rounded" />
                <div className="h-3 w-16 bg-slate-100 rounded" />
            </div>
        )
    }

    return (
        <div className="hidden lg:flex items-center gap-4 px-4 border-l border-slate-100 ml-2 h-14 bg-white/50">
            {statuses.map((s) => (
                <div key={s.name} className="flex flex-col items-start gap-0.5 group cursor-default">
                    <div className="flex items-center gap-1.5 min-w-[80px]">
                        <div className={cn(
                            "h-1.5 w-1.5 rounded-full transition-all duration-500",
                            s.status === 'online' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" :
                                s.status === 'degraded' ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                        )} />
                        <span className="text-[10px] font-black uppercase text-slate-800 tracking-[0.05em] group-hover:text-amber-600 transition-colors">
                            {s.name}
                        </span>
                        <ArrowUpRight className="h-2 w-2 text-slate-300 opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
                    </div>
                    <div className="flex items-center gap-1">
                        <span className={cn(
                            "text-[8px] font-bold uppercase tracking-tighter transition-colors",
                            s.status === 'online' ? "text-emerald-500" :
                                s.status === 'degraded' ? "text-amber-500" : "text-red-500"
                        )}>
                            {s.status}
                        </span>
                        <span className="text-[8px] text-slate-300 font-bold tabular-nums">/ {s.latency}</span>
                    </div>
                </div>
            ))}
        </div>
    )
}
