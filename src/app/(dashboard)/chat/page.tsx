"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Hash, Send, Plus, Users, Search, MoreVertical, Paperclip, Smile } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface Message {
    id: string
    content: string
    createdAt: string
    userId: string
    user: {
        name: string
        email: string
        image?: string
    }
}

interface Channel {
    id: string
    name: string
    description?: string
}

export default function ChatRoomPage() {
    const { data: session } = useSession()
    const [channels, setChannels] = React.useState<Channel[]>([])
    const [activeChannel, setActiveChannel] = React.useState<Channel | null>(null)
    const [messages, setMessages] = React.useState<Message[]>([])
    const [newMessage, setNewMessage] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(true)
    const scrollRef = React.useRef<HTMLDivElement>(null)

    // Load Channels
    React.useEffect(() => {
        fetch('/api/chat/channels')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setChannels(data)
                    if (data.length > 0) setActiveChannel(data[0])
                }
                setIsLoading(false)
            })
            .catch(err => {
                console.error('Failed to load channels:', err)
                setIsLoading(false)
            })
    }, [])

    // Polling for messages
    const fetchMessages = React.useCallback(() => {
        if (!activeChannel) return
        fetch(`/api/chat/messages?channelId=${activeChannel.id}`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch')
                return res.json()
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setMessages(data)
                }
            })
            .catch(err => console.error('Polling error:', err))
    }, [activeChannel])

    React.useEffect(() => {
        fetchMessages()
        const interval = setInterval(fetchMessages, 3000)
        return () => clearInterval(interval)
    }, [fetchMessages])

    // Scroll to bottom
    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth"
            })
        }
    }, [messages])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || !activeChannel) return

        const content = newMessage
        setNewMessage("")

        try {
            const res = await fetch('/api/chat/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    channelId: activeChannel.id,
                    content
                })
            })
            if (res.ok) {
                const msg = await res.json()
                setMessages(prev => [...prev, msg])
            }
        } catch (e) {
            console.error(e)
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center bg-slate-50/30">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
                    <p className="font-bold text-slate-500 animate-pulse">Initializing Team Chat...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-full overflow-hidden bg-white">
            {/* Channels Sidebar */}
            <div className="w-72 border-r bg-slate-50/50 flex flex-col shrink-0">
                <div className="p-6 border-b bg-white">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Channels</h2>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-amber-100 hover:text-amber-700">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        <Input
                            placeholder="Find or start a chat..."
                            className="pl-9 h-9 bg-slate-100/50 border-none text-xs font-semibold rounded-xl focus-visible:ring-amber-500"
                        />
                    </div>
                </div>

                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-1">
                        {channels.map(channel => (
                            <button
                                key={channel.id}
                                onClick={() => setActiveChannel(channel)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group",
                                    activeChannel?.id === channel.id
                                        ? "bg-amber-500 text-white shadow-lg shadow-amber-200"
                                        : "text-slate-600 hover:bg-white hover:shadow-sm"
                                )}
                            >
                                <Hash className={cn(
                                    "h-4 w-4",
                                    activeChannel?.id === channel.id ? "text-white" : "text-slate-400 group-hover:text-amber-500"
                                )} />
                                <span className="font-bold text-sm truncate uppercase tracking-wide">{channel.name}</span>
                            </button>
                        ))}
                    </div>
                </ScrollArea>

                <div className="p-4 border-t bg-white">
                    <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-100/50">
                        <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                            <AvatarImage src={session?.user?.image || ""} />
                            <AvatarFallback className="bg-amber-500 text-white font-bold text-xs uppercase">
                                {session?.user?.name?.charAt(0) || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-black text-slate-900 truncate tracking-tight">{session?.user?.name}</p>
                            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Online</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#fbfcfe]">
                {/* Header */}
                <div className="h-16 border-b px-8 flex items-center justify-between bg-white shadow-sm z-10">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                            <Hash className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                            <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
                                {activeChannel?.name || "Select Channel"}
                            </h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {activeChannel?.description || "Channel for team collaboration"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex -space-x-2">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-sm overflow-hidden">
                                    <Users className="h-3 w-3" />
                                </div>
                            ))}
                        </div>
                        <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">34 Online</span>
                        <div className="h-4 w-px bg-slate-200 mx-1" />
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-slate-100 text-slate-400">
                            <MoreVertical className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-hidden relative">
                    <div
                        ref={scrollRef}
                        className="h-full overflow-y-auto px-8 pt-6 pb-24 scroll-smooth custom-scrollbar"
                    >
                        <div className="space-y-8 max-w-4xl mx-auto">
                            {messages.map((msg, i) => {
                                const isMe = msg.user.email === session?.user?.email
                                const prevMsg = messages[i - 1]
                                const isCondensed = prevMsg && prevMsg.user.email === msg.user.email &&
                                    (new Date(msg.createdAt).getTime() - new Date(prevMsg.createdAt).getTime() < 60000)

                                return (
                                    <div key={msg.id} className={cn(
                                        "flex gap-4 group transition-all duration-300",
                                        isMe ? "flex-row-reverse" : "flex-row",
                                        isCondensed ? "mt-[-24px]" : ""
                                    )}>
                                        {!isCondensed && (
                                            <Avatar className="h-10 w-10 border-2 border-white shadow-sm shrink-0 mt-1">
                                                <AvatarImage src={msg.user.image} />
                                                <AvatarFallback className="bg-slate-200 text-slate-600 font-bold text-xs">
                                                    {msg.user.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                        {isCondensed && <div className="w-10 shrink-0" />}

                                        <div className={cn(
                                            "flex flex-col gap-1.5 max-w-[70%]",
                                            isMe ? "items-end" : "items-start"
                                        )}>
                                            {!isCondensed && (
                                                <div className="flex items-center gap-2 px-1">
                                                    <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{msg.user.name}</span>
                                                    <span className="text-[10px] font-bold text-slate-400">{format(new Date(msg.createdAt), 'h:mm a')}</span>
                                                </div>
                                            )}
                                            <div className={cn(
                                                "px-5 py-3 rounded-2xl text-[13px] font-medium leading-relaxed shadow-sm group-hover:shadow-md transition-shadow duration-300",
                                                isMe
                                                    ? "bg-amber-500 text-white rounded-tr-none"
                                                    : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
                                            )}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="h-4" />
                    </div>

                    {/* Input Area */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#fbfcfe] via-[#fbfcfe] to-transparent">
                        <form
                            onSubmit={handleSendMessage}
                            className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center p-2 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all duration-300"
                        >
                            <Button type="button" variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-amber-500 rounded-xl">
                                <Smile className="h-5 w-5" />
                            </Button>
                            <Button type="button" variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-amber-500 rounded-xl">
                                <Paperclip className="h-5 w-5" />
                            </Button>
                            <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder={`Message #${activeChannel?.name || '...'}`}
                                className="flex-1 bg-transparent border-none focus-visible:ring-0 text-sm font-semibold h-11"
                            />
                            <Button
                                type="submit"
                                disabled={!newMessage.trim()}
                                className="h-10 w-10 bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-lg shadow-amber-200 transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
