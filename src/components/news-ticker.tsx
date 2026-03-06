"use client"

import * as React from "react"
import { getMedicalNews } from "@/app/actions/news"
import { Activity, Globe, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

export function NewsTicker() {
    const [news, setNews] = React.useState<string[]>([])
    const [isLoading, setIsLoading] = React.useState(true)

    const fetchNews = async () => {
        const headlines = await getMedicalNews()
        setNews(headlines)
        setIsLoading(false)
    }

    React.useEffect(() => {
        fetchNews()
        // Refresh news every 30 minutes
        const interval = setInterval(fetchNews, 30 * 60 * 1000)
        return () => clearInterval(interval)
    }, [])

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center h-full px-8">
                <div className="w-full max-w-md h-6 bg-slate-50 animate-pulse rounded-full border border-slate-100" />
            </div>
        )
    }

    return (
        <div className="flex-1 flex items-center h-full overflow-hidden relative pointer-events-none">

            <div className="flex items-center gap-4 bg-slate-50/80 border border-slate-200/60 rounded-full py-1.5 px-4 shadow-sm w-full group overflow-hidden">
                <div className="flex items-center gap-2 shrink-0 border-r border-slate-200 pr-3 z-20 bg-transparent">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live News</span>
                </div>

                <div className="relative flex-1 h-5 overflow-hidden">
                    <div className="flex whitespace-nowrap animate-ticker hover:[animation-play-state:paused] cursor-pointer touch-none">
                        {/* Duplicate news to create a seamless loop */}
                        {[...news, ...news].map((item, i) => (
                            <div key={i} className="flex items-center gap-6 px-4">
                                <p className="text-[11px] font-bold text-slate-700 tracking-tight flex items-center gap-2">
                                    <Globe className="h-3 w-3 text-amber-500" />
                                    {item}
                                </p>
                                <span className="h-1 w-1 rounded-full bg-slate-200" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 border-l border-slate-200 pl-3 z-20 bg-transparent">
                    <Zap className="h-3 w-3 text-amber-500 fill-amber-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">US Health Feed</span>
                </div>
            </div>
        </div>
    )
}
