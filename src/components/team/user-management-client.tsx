"use client"

import * as React from "react"
import {
    Users,
    UserPlus,
    ShieldCheck,
    ShieldAlert,
    UserCog,
    MoreVertical,
    Trash2,
    Search,
    Mail,
    Calendar,
    Check,
    X,
    Filter,
    Shield
} from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createUser, updateUserRole, deleteUser } from "@/app/actions/users"
import { cn } from "@/lib/utils"

interface User {
    id: string
    name: string | null
    email: string
    role: string
    createdAt: Date
    image: string | null
}

export function UserManagementClient({ initialUsers }: { initialUsers: User[] }) {
    const [users, setUsers] = React.useState<User[]>(initialUsers)
    const [search, setSearch] = React.useState("")
    const [roleFilter, setRoleFilter] = React.useState("ALL")
    const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)

    const [newUser, setNewUser] = React.useState({
        name: "",
        email: "",
        password: "",
        role: "AGENT"
    })

    const filteredUsers = users.filter((u) => {
        const matchesSearch = (u.name?.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
        const matchesRole = roleFilter === "ALL" || u.role === roleFilter
        return matchesSearch && matchesRole
    })

    const stats = {
        total: users.length,
        admin: users.filter(u => u.role === 'ADMIN').length,
        manager: users.filter(u => u.role === 'MANAGER').length,
        agent: users.filter(u => u.role === 'AGENT').length,
    }

    const handleAddUser = async () => {
        if (!newUser.email || !newUser.name) return
        setIsLoading(true)
        const res = await createUser(newUser)
        if (res.success && res.user) {
            setUsers([res.user, ...users])
            setIsAddDialogOpen(false)
            setNewUser({ name: "", email: "", password: "", role: "AGENT" })
        } else {
            alert(res.error || "Failed to create user")
        }
        setIsLoading(false)
    }

    const handleRoleUpdate = async (userId: string, newRole: string) => {
        const res = await updateUserRole(userId, newRole)
        if (res.success) {
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
        } else {
            alert(res.error || "Failed to update role")
        }
    }

    const handleDelete = async (userId: string) => {
        if (confirm("Are you sure you want to delete this user?")) {
            const res = await deleteUser(userId)
            if (res.success) {
                setUsers(users.filter(u => u.id !== userId))
            } else {
                alert(res.error || "Failed to delete user")
            }
        }
    }

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'ADMIN':
                return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200 font-bold px-3 py-1 rounded-lg">ADMIN</Badge>
            case 'MANAGER':
                return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200 font-bold px-3 py-1 rounded-lg">MANAGER</Badge>
            case 'AGENT':
                return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100 border-slate-200 font-bold px-3 py-1 rounded-lg">AGENT</Badge>
            case 'OWNER':
                return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200 font-bold px-3 py-1 rounded-lg">OWNER</Badge>
            default:
                return <Badge variant="secondary">{role}</Badge>
        }
    }

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'ADMIN': return <ShieldCheck className="h-4 w-4 text-amber-600" />
            case 'MANAGER': return <Shield className="h-4 w-4 text-blue-600" />
            case 'AGENT': return <Users className="h-4 w-4 text-slate-500" />
            case 'OWNER': return <ShieldAlert className="h-4 w-4 text-emerald-600" />
            default: return null
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard label="Total Personnel" value={stats.total} icon={<Users className="h-5 w-5" />} color="slate" />
                <StatCard label="Administrators" value={stats.admin} icon={<ShieldCheck className="h-5 w-5" />} color="amber" />
                <StatCard label="Operations Managers" value={stats.manager} icon={<Shield className="h-5 w-5" />} color="blue" />
                <StatCard label="Field Agents" value={stats.agent} icon={<Users className="h-5 w-5" />} color="emerald" />
            </div>

            <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] bg-white overflow-hidden">
                <CardHeader className="p-8 border-b border-slate-50/50 bg-white">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-amber-50 rounded-2xl">
                                <UserCog className="h-6 w-6 text-amber-600" />
                            </div>
                            <div>
                                <CardTitle className="text-xl font-black text-slate-900 tracking-tight">Access Control</CardTitle>
                                <p className="text-sm text-slate-400 font-medium">Manage permissions and team roles</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
                                <Input
                                    placeholder="Search by name or email..."
                                    className="pl-12 rounded-2xl border-slate-100 bg-slate-50/50 w-full md:w-80 h-12 focus-visible:ring-amber-500 focus-visible:ring-offset-0 transition-all"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            <Select value={roleFilter} onValueChange={setRoleFilter}>
                                <SelectTrigger className="w-[160px] h-12 rounded-2xl border-slate-100 bg-slate-50/50 font-bold text-slate-600">
                                    <div className="flex items-center gap-2">
                                        <Filter className="h-3.5 w-3.5" />
                                        <SelectValue placeholder="Role Filter" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                                    <SelectItem value="ALL">All Roles</SelectItem>
                                    <SelectItem value="ADMIN">Administrators</SelectItem>
                                    <SelectItem value="MANAGER">Managers</SelectItem>
                                    <SelectItem value="AGENT">Agents</SelectItem>
                                </SelectContent>
                            </Select>

                            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="rounded-2xl bg-amber-500 hover:bg-amber-600 font-black px-6 h-12 shadow-lg shadow-amber-200 border-none text-slate-900 transition-all hover:scale-[1.02] active:scale-[0.98]">
                                        <UserPlus className="mr-2 h-5 w-5" /> New Member
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden max-w-md bg-white">
                                    <div className="bg-amber-500 p-8 text-slate-900">
                                        <DialogTitle className="text-2xl font-black tracking-tight mb-2">Invite Collaborator</DialogTitle>
                                        <DialogDescription className="text-slate-900/70 font-bold">
                                            Grant system access to a new team member.
                                        </DialogDescription>
                                    </div>
                                    <div className="p-8 space-y-6">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                                                <Input
                                                    placeholder="e.g. Sarah Jenkins"
                                                    className="rounded-xl border-slate-100 h-12 focus-visible:ring-amber-500"
                                                    value={newUser.name}
                                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                                                <Input
                                                    type="email"
                                                    placeholder="sarah@deltamedical.com"
                                                    className="rounded-xl border-slate-100 h-12 focus-visible:ring-amber-500"
                                                    value={newUser.email}
                                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Default Password</label>
                                                <Input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    className="rounded-xl border-slate-100 h-12 focus-visible:ring-amber-500"
                                                    value={newUser.password}
                                                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Access Tier</label>
                                                <Select value={newUser.role} onValueChange={(v) => setNewUser({ ...newUser, role: v })}>
                                                    <SelectTrigger className="h-12 rounded-xl border-slate-100 font-bold">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl border-slate-100 bg-white">
                                                        <SelectItem value="AGENT">Agent (Limited Access)</SelectItem>
                                                        <SelectItem value="MANAGER">Manager (Operational Access)</SelectItem>
                                                        <SelectItem value="ADMIN">Admin (Full Access)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-8 pt-0 flex gap-3">
                                        <Button variant="ghost" className="flex-1 h-12 rounded-xl font-bold" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                                        <Button
                                            className="flex-1 h-12 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-900 font-black shadow-lg shadow-amber-200"
                                            onClick={handleAddUser}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "Processing..." : "Create Account"}
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </CardHeader>
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-slate-50/50 h-16">
                                <TableHead className="pl-8 text-xs font-black uppercase tracking-widest text-slate-400">Personnel</TableHead>
                                <TableHead className="text-xs font-black uppercase tracking-widest text-slate-400">Security Clearance</TableHead>
                                <TableHead className="text-xs font-black uppercase tracking-widest text-slate-400">System Identity</TableHead>
                                <TableHead className="text-xs font-black uppercase tracking-widest text-slate-400">Onboarding Date</TableHead>
                                <TableHead className="pr-8 text-right text-xs font-black uppercase tracking-widest text-slate-400">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center text-slate-400 font-medium italic">
                                        No team members found matching your search criteria.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((user) => (
                                    <TableRow key={user.id} className="group hover:bg-slate-50/40 transition-all border-slate-50">
                                        <TableCell className="pl-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <Avatar className="h-12 w-12 rounded-2xl border-2 border-white shadow-sm ring-1 ring-slate-100">
                                                    <AvatarImage src={user.image || ""} />
                                                    <AvatarFallback className="bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 font-black text-xs">
                                                        {(user.name || user.email).substring(0, 2).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex flex-col">
                                                    <p className="font-black text-slate-900 tracking-tight leading-none mb-1.5">{user.name || "System User"}</p>
                                                    <div className="flex items-center gap-1.5 text-slate-400 font-bold text-[11px] uppercase tracking-wider">
                                                        <Mail className="h-3 w-3" />
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                {getRoleBadge(user.role)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-slate-500 font-mono text-xs font-bold tracking-tighter bg-slate-50/80 px-3 py-1.5 rounded-xl border border-slate-100 w-fit">
                                                ID: {user.id.substring(0, 8).toUpperCase()}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2 text-slate-500 font-bold text-xs uppercase tracking-tight">
                                                <Calendar className="h-3.5 w-3.5 text-slate-300" />
                                                {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </TableCell>
                                        <TableCell className="pr-8 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-white hover:shadow-md transition-all">
                                                        <MoreVertical className="h-5 w-5 text-slate-400" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 rounded-2xl border-slate-100 shadow-xl p-2">
                                                    <DropdownMenuLabel className="px-3 py-2 text-xs font-black uppercase tracking-widest text-slate-400">Modify Clearance</DropdownMenuLabel>
                                                    <DropdownMenuItem
                                                        className="rounded-xl px-3 py-2.5 font-bold focus:bg-amber-50 focus:text-amber-700"
                                                        onClick={() => handleRoleUpdate(user.id, "ADMIN")}
                                                    >
                                                        <ShieldCheck className="mr-2 h-4 w-4" /> Elevate to Admin
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="rounded-xl px-3 py-2.5 font-bold focus:bg-blue-50 focus:text-blue-700"
                                                        onClick={() => handleRoleUpdate(user.id, "MANAGER")}
                                                    >
                                                        <Shield className="mr-2 h-4 w-4" /> Appoint as Manager
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="rounded-xl px-3 py-2.5 font-bold focus:bg-slate-50 focus:text-slate-700"
                                                        onClick={() => handleRoleUpdate(user.id, "AGENT")}
                                                    >
                                                        <Users className="mr-2 h-4 w-4" /> Set as Field Agent
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="my-2 bg-slate-50" />
                                                    <DropdownMenuItem
                                                        className="rounded-xl px-3 py-2.5 font-bold text-red-600 focus:bg-red-50 focus:text-red-700"
                                                        onClick={() => handleDelete(user.id)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" /> Revoke Access
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
                <div className="p-8 bg-slate-50/30 border-t border-slate-50/50 flex items-center justify-between">
                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">System Monitoring Active</p>
                    <div className="flex gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-tighter text-emerald-600">All Nodes Operational</span>
                    </div>
                </div>
            </Card>
        </div>
    )
}

function StatCard({ label, value, icon, color }: { label: string, value: number, icon: React.ReactNode, color: string }) {
    const colors = {
        slate: "bg-slate-900 text-white shadow-slate-200",
        amber: "bg-white text-slate-900 border-slate-100 shadow-slate-100",
        blue: "bg-white text-slate-900 border-slate-100 shadow-slate-100",
        emerald: "bg-white text-slate-900 border-slate-100 shadow-slate-100"
    } as any

    const iconColors = {
        slate: "bg-white/10 text-amber-500",
        amber: "bg-amber-50 text-amber-600",
        blue: "bg-blue-50 text-blue-600",
        emerald: "bg-emerald-50 text-emerald-600"
    } as any

    return (
        <Card className={cn("border-none shadow-sm rounded-[2rem] overflow-hidden group hover:shadow-xl transition-all duration-300", colors[color])}>
            <CardContent className="p-8 flex items-center justify-between">
                <div className="flex flex-col">
                    <p className={cn("text-xs font-black uppercase tracking-[0.2em] mb-2 opacity-60", color === 'slate' ? 'text-slate-400' : 'text-slate-400')}>{label}</p>
                    <h3 className="text-4xl font-black tracking-tighter">{value}</h3>
                </div>
                <div className={cn("p-5 rounded-[1.5rem] transition-all group-hover:scale-110 duration-500", iconColors[color])}>
                    {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "h-7 w-7" })}
                </div>
            </CardContent>
        </Card>
    )
}
