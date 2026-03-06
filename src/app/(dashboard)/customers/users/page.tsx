import React from "react"
import {
    UserPlus,
    Mail,
    Shield,
    Activity,
    MoreVertical,
    Lock,
    Unlock,
    ExternalLink,
    Filter,
    Search
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

const users = [
    { name: "Dr. Sarah Jenkins", email: "sarah.j@globalhealth.com", role: "Admin", status: "Online", company: "Global Health Corp", lastActive: "Just now", avatar: "SJ" },
    { name: "Mark Thompson", email: "mark.t@apexbio.lan", role: "Editor", status: "Offline", company: "Apex BioLabs", lastActive: "2 hours ago", avatar: "MT" },
    { name: "Elena Rodriguez", email: "e.rodriguez@northstar.med", role: "Viewer", status: "Online", company: "NorthStar Medical", lastActive: "10 mins ago", avatar: "ER" },
    { name: "James Wilson", email: "j.wilson@deltapharma.co", role: "Admin", status: "Offline", company: "Delta Pharma", lastActive: "Yesterday", avatar: "JW" },
    { name: "Sophia Chen", email: "s.chen@ziondx.com", role: "Editor", status: "Online", company: "Zion Diagnostics", lastActive: "5 mins ago", avatar: "SC" },
    { name: "Alex Varga", email: "a.varga@globalhealth.com", role: "Viewer", status: "Online", company: "Global Health Corp", lastActive: "Just now", avatar: "AV" },
]

export default function ClientUsersPage() {
    return (
        <div className="p-8 space-y-8 bg-slate-50/20 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1">Client Access & Users</h1>
                    <p className="text-slate-500 font-medium">Manage user credentials and permission matrices for all client accounts.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="rounded-2xl border-slate-200 font-bold px-6 h-12 bg-white hover:shadow-lg transition-all">
                        <Shield className="mr-2 h-4 w-4 text-amber-500" /> Audit Log
                    </Button>
                    <Button className="rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black px-6 h-12 shadow-xl shadow-slate-200 transition-all active:scale-95 border-none">
                        <UserPlus className="mr-2 h-5 w-5 text-amber-500" /> Invite New User
                    </Button>
                </div>
            </div>

            {/* Selection Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-[2rem] shadow-sm border border-slate-50">
                <div className="relative group w-full sm:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                    <Input
                        placeholder="Search by name, email or company..."
                        className="pl-11 pr-4 rounded-xl border-none bg-slate-50 focus:bg-white focus:ring-0 focus:shadow-inner transition-all h-11"
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button variant="ghost" className="rounded-xl font-bold text-slate-500 hover:bg-slate-50">
                        <Filter className="mr-2 h-4 w-4" /> Filter Roles
                    </Button>
                    <div className="w-[1px] h-6 bg-slate-100 hidden sm:block" />
                    <Button variant="ghost" className="rounded-xl font-bold text-slate-500 hover:bg-slate-50">
                        Sort: Recently Active
                    </Button>
                </div>
            </div>

            {/* User Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user, i) => (
                    <Card key={i} className="border-none shadow-sm rounded-[2.5rem] bg-white group hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden">
                        <CardHeader className="p-8 pb-4 flex flex-row items-start justify-between space-y-0">
                            <div className="relative">
                                <Avatar className="h-20 w-20 rounded-3xl border-4 border-slate-50 shadow-md group-hover:scale-105 transition-transform duration-500">
                                    <AvatarFallback className="bg-slate-900 text-white text-xl font-black">{user.avatar}</AvatarFallback>
                                </Avatar>
                                <div className={`absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-4 border-white flex items-center justify-center ${user.status === 'Online' ? 'bg-green-500' : 'bg-slate-300'
                                    }`}>
                                    <div className="w-1.5 h-1.5 rounded-full bg-white opacity-40" />
                                </div>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-xl hover:bg-slate-50">
                                        <MoreVertical className="h-5 w-5 text-slate-400" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rounded-2xl p-2 border-slate-100 shadow-xl">
                                    <DropdownMenuItem className="rounded-xl font-bold text-[13px] py-3 cursor-pointer">
                                        <ExternalLink className="mr-2 h-4 w-4" /> View Profile
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="rounded-xl font-bold text-[13px] py-3 cursor-pointer">
                                        <Lock className="mr-2 h-4 w-4" /> Reset Password
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="rounded-xl font-bold text-[13px] py-3 text-rose-500 hover:text-rose-600 hover:bg-rose-50 cursor-pointer">
                                        Deactivate User
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardHeader>
                        <CardContent className="p-8 pt-4">
                            <div className="mb-6">
                                <h3 className="text-xl font-black text-slate-900 mb-1 group-hover:text-amber-600 transition-colors uppercase tracking-tight">{user.name}</h3>
                                <div className="flex items-center gap-2 text-slate-400 text-[13px] font-bold">
                                    <Mail className="h-3.5 w-3.5" />
                                    {user.email}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-3 border-y border-slate-50">
                                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Company</span>
                                    <span className="text-[13px] font-black text-slate-700">{user.company}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Role</span>
                                    <Badge className={`rounded-lg px-3 py-1 font-black text-[10px] uppercase tracking-wider ${user.role === 'Admin' ? 'bg-amber-100 text-amber-700' :
                                        user.role === 'Editor' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                                        } border-none`}>
                                        {user.role}
                                    </Badge>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-green-500" />
                                    <span className="text-[12px] font-bold text-slate-500">Active {user.lastActive}</span>
                                </div>
                                <Button variant="ghost" className="text-amber-600 font-black text-[12px] p-0 h-auto hover:bg-transparent hover:text-amber-700">
                                    Edit Roles →
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Pagination / Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between p-8 bg-slate-900 rounded-[3rem] shadow-2xl mt-12 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="relative z-10">
                    <h4 className="text-white font-black text-lg mb-1">User Management Control</h4>
                    <p className="text-slate-400 text-sm font-medium">Monitoring 2,450 active sessions across all client networks.</p>
                </div>
                <div className="flex items-center gap-4 relative z-10 mt-4 sm:mt-0">
                    <span className="text-slate-500 font-bold text-sm">Page 1 of 42</span>
                    <div className="flex gap-2">
                        <Button variant="outline" className="rounded-xl border-slate-800 text-white hover:bg-slate-800 font-bold">Prev</Button>
                        <Button className="rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-black border-none">Next</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
