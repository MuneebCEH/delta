"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Hash, Send, Plus, Users, Search, MoreVertical, Paperclip, Smile, MessageCircle, User } from "lucide-react"
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
    type: 'PUBLIC' | 'DIRECT'
}

interface ChatUser {
    id: string
    name: string
    email: string
    image?: string
    role: string
}

export default function ChatRoomPage() {
    const { data: session, status } = useSession()
    const [channels, setChannels] = React.useState<Channel[]>([])
    const [users, setUsers] = React.useState<ChatUser[]>([])
    const [activeChannel, setActiveChannel] = React.useState<Channel | null>(null)
    const [messages, setMessages] = React.useState<Message[]>([])
    const [newMessage, setNewMessage] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(true)
    const scrollRef = React.useRef<HTMLDivElement>(null)

    // Load Channels and Users
    React.useEffect(() => {
        if (status === "loading") return;

        const loadData = async () => {
            try {
                const [channelsRes, usersRes] = await Promise.all([
                    fetch('/api/chat/channels'),
                    fetch('/api/chat/users')
                ])

                const channelsData = await channelsRes.json()
                const usersData = await usersRes.json()

                if (Array.isArray(channelsData)) {
                    setChannels(channelsData)
                    if (channelsData.length > 0) setActiveChannel(channelsData[0])
                }
                if (Array.isArray(usersData)) {
                    setUsers(usersData.filter(u => u.email !== session?.user?.email))
                }
            } catch (err) {
                console.error('Failed to load chat data:', err)
            } finally {
                setIsLoading(false)
            }
        }

        loadData()
    }, [status, session?.user?.email])

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

    const startDirectMessage = async (targetUser: ChatUser) => {
        // Direct messages would normally need a dedicated API to create/find a private channel
        // For now, since we want click to work, we'll try to find if a channel already exists with this name or create a temporary one
        // Simulating direct messages using channel name for now to provide the UI experience
        const dmName = `DM: ${targetUser.name}`
        const existing = channels.find(c => c.name === dmName)

        if (existing) {
            setActiveChannel(existing)
        } else {
            try {
                const res = await fetch('/api/chat/channels', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: dmName,
                        description: `Direct message with ${targetUser.name}`,
                        type: 'DIRECT'
                    })
                })
                if (res.ok) {
                    const newChan = await res.json()
                    setChannels(prev => [...prev, newChan])
                    setActiveChannel(newChan)
                }
            } catch (e) {
                console.error(e)
            }
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
        <div className="flex w-full h-[calc(100vh-56px)] overflow-hidden bg-white">
            {/* Sidebar Left: Channels & Users */}
            <div className="w-80 border-r bg-slate-50/50 flex flex-col shrink-0">
                <div className="p-6 border-b bg-white">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Team Hub</h2>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-amber-100">
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search team..."
                            className="pl-10 h-10 bg-slate-100/50 border-none text-sm font-semibold rounded-xl"
                        />
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="p-4 space-y-6">
                        {/* Channels Section */}
                        <div className="space-y-1">
                            <h3 className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Channels</h3>
                            {channels.filter(c => c.type !== 'DIRECT').map(channel => (
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
                                    <Hash className={cn("h-4 w-4", activeChannel?.id === channel.id ? "text-white" : "text-slate-400")} />
                                    <span className="font-bold text-sm truncate uppercase tracking-wide">{channel.name}</span>
                                </button>
                            ))}
                        </div>

                        {/* Direct Messages Section */}
                        <div className="space-y-1">
                            <h3 className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 font-black">Registered Team</h3>
                            {users.map(u => (
                                <button
                                    key={u.id}
                                    onClick={() => startDirectMessage(u)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 group hover:bg-white hover:shadow-sm",
                                        activeChannel?.name?.includes(u.name) ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100" : "text-slate-600"
                                    )}
                                >
                                    <div className="relative">
                                        <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                                            <AvatarImage src={u.image} />
                                            <AvatarFallback className="bg-slate-200 text-slate-600 font-bold text-[10px] uppercase">
                                                {u.name?.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-slate-50" />
                                    </div>
                                    <div className="flex-1 text-left overflow-hidden">
                                        <p className="font-bold text-xs truncate leading-none mb-1 uppercase tracking-tight">{u.name}</p>
                                        <p className="text-[10px] font-semibold text-slate-400 truncate uppercase tracking-widest">{u.role}</p>
                                    </div>
                                    <MessageCircle className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 text-emerald-500 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    </div>
                </ScrollArea>

                <div className="p-4 border-t bg-white">
                    <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-100/50">
                        <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                            <AvatarImage src={session?.user?.image || ""} />
                            <AvatarFallback className="bg-amber-500 text-white font-bold text-xs">
                                {session?.user?.name?.charAt(0) || "U"}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-black text-slate-900 truncate tracking-tight">{session?.user?.name}</p>
                            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Active Now</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#f8fafc]">
                {/* Header */}
                <div className="h-16 border-b px-8 flex items-center justify-between bg-white shadow-sm shrink-0">
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            "h-10 w-10 rounded-2xl flex items-center justify-center",
                            activeChannel?.type === 'DIRECT' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                        )}>
                            {activeChannel?.type === 'DIRECT' ? <User className="h-5 w-5" /> : <Hash className="h-5 w-5" />}
                        </div>
                        <div>
                            <h3 className="text-base font-black text-slate-900 uppercase tracking-tight">
                                {activeChannel?.name || "Select Channel"}
                            </h3>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                {activeChannel?.description || "Online Team Members Activity"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400 hover:text-amber-500 hover:bg-slate-50">
                            <Users className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-400 hover:text-amber-500 hover:bg-slate-50">
                            <MoreVertical className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-hidden relative">
                    <div
                        ref={scrollRef}
                        className="h-full overflow-y-auto px-8 pt-6 pb-28 scroll-smooth custom-scrollbar"
                    >
                        <div className="max-w-4xl mx-auto space-y-8">
                            {messages.length === 0 && (
                                <div className="flex flex-col items-center justify-center pt-20 text-center opacity-40">
                                    <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                        <MessageCircle className="h-8 w-8 text-slate-300" />
                                    </div>
                                    <p className="text-sm font-black uppercase tracking-widest">Start the conversation</p>
                                    <p className="text-xs font-bold uppercase tracking-widest mt-1">Send a message to # {activeChannel?.name}</p>
                                </div>
                            )}

                            {messages.map((msg, i) => {
                                const isMe = msg.user.email === session?.user?.email
                                const prevMsg = messages[i - 1]
                                const isCondensed = prevMsg && prevMsg.user.email === msg.user.email &&
                                    (new Date(msg.createdAt).getTime() - new Date(prevMsg.createdAt).getTime() < 60000)

                                return (
                                    <div key={msg.id} className={cn(
                                        "flex gap-4",
                                        isMe ? "flex-row-reverse" : "flex-row",
                                        isCondensed ? "-mt-6" : "mt-0"
                                    )}>
                                        {!isCondensed && (
                                            <Avatar className="h-10 w-10 border-2 border-white shadow-sm mt-1 shrink-0">
                                                <AvatarImage src={msg.user.image} />
                                                <AvatarFallback className="bg-slate-200 text-slate-600 font-bold text-[10px] uppercase">
                                                    {msg.user.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                        {isCondensed && <div className="w-10 shrink-0" />}

                                        <div className={cn(
                                            "flex flex-col gap-1.5 max-w-[75%]",
                                            isMe ? "items-end" : "items-start"
                                        )}>
                                            {!isCondensed && (
                                                <div className="flex items-center gap-2 px-1">
                                                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{msg.user.name}</span>
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase">{format(new Date(msg.createdAt), 'h:mm a')}</span>
                                                </div>
                                            )}
                                            <div className={cn(
                                                "px-5 py-3 rounded-2xl text-[13px] font-bold leading-relaxed shadow-sm uppercase tracking-tight",
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
                    </div>

                    {/* Input Area */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#f8fafc] via-[#f8fafc] to-transparent">
                        <form
                            onSubmit={handleSendMessage}
                            className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-100 flex items-center p-2"
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
                                placeholder={`Write to #${activeChannel?.name || '...'}`}
                                className="flex-1 bg-transparent border-none focus-visible:ring-0 text-sm font-bold uppercase tracking-tight h-11"
                            />
                            <Button
                                type="submit"
                                disabled={!newMessage.trim()}
                                className="h-10 w-10 bg-amber-500 hover:bg-amber-600 text-white rounded-xl shadow-lg shadow-amber-200 transition-all active:scale-95 disabled:opacity-50"
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
