"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    FolderKanban,
    Home,
    Settings,
    Users,
    Table2,
    Database,
    Calendar as CalendarIcon,
    PanelLeftClose,
    PanelLeftOpen,
    Menu,
    CheckSquare,
    PhoneIncoming,
    Wallet,
    Bookmark,
    FileSignature,
    MessageSquare,
    BarChart3,
    User,
    ChevronDown,
    ClipboardCheck,
    Activity,
    FileText,
    ShieldCheck,
    Cpu,
    Search,
    FileSearch
} from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function MainSidebar({ className }: SidebarProps) {
    const pathname = usePathname()
    const [isCollapsed, setIsCollapsed] = React.useState(false)

    return (
        <div className={cn(
            "relative flex flex-col border-r h-full transition-all duration-300 ease-in-out bg-white shadow-sm",
            isCollapsed ? "w-16" : "w-64",
            className
        )}>
            <div className={cn(
                "flex items-center h-14 border-b shrink-0 overflow-hidden transition-all duration-300",
                isCollapsed ? "justify-center px-0" : "px-4 justify-between"
            )}>
                {!isCollapsed && (
                    <span className="font-bold text-xl truncate text-amber-600 animate-in fade-in duration-300">
                        Delta Medical
                    </span>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className={cn(
                        "shrink-0 hover:bg-red-600 hover:text-white text-slate-900 transition-colors duration-200",
                        isCollapsed ? "h-10 w-10" : "h-8 w-8"
                    )}
                >
                    <Menu className="h-5 w-5" />
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
                <div className="space-y-4 py-4 px-3">
                    <div className="space-y-1">
                        {!isCollapsed && (
                            <h2 className="mb-2 px-4 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                                Main
                            </h2>
                        )}
                        <SidebarItem
                            href="/dashboard"
                            icon={<Home className="h-4 w-4" />}
                            label="Dashboard"
                            active={pathname === "/dashboard"}
                            collapsed={isCollapsed}
                        />
                        <SidebarItem
                            href="/calendar"
                            icon={<CalendarIcon className="h-4 w-4" />}
                            label="Calendar"
                            active={pathname === "/calendar"}
                            collapsed={isCollapsed}
                        />
                        <SidebarItem
                            href="/automation"
                            icon={<Settings className="h-4 w-4" />}
                            label="Automation"
                            active={pathname === "/automation"}
                            collapsed={isCollapsed}
                        />
                        <SidebarItem
                            href="/projects"
                            icon={<FolderKanban className="h-4 w-4" />}
                            label="Projects"
                            active={pathname === "/projects"}
                            collapsed={isCollapsed}
                        />
                    </div>

                    <div className="space-y-1">
                        {!isCollapsed && (
                            <h2 className="mb-2 px-4 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                                DMS
                            </h2>
                        )}
                        <SidebarItem
                            href="/dms/eligibility"
                            icon={<ClipboardCheck className="h-4 w-4" />}
                            label="Eligibility"
                            active={pathname === "/dms/eligibility"}
                            collapsed={isCollapsed}
                        />
                        <SidebarItem
                            href="/dms/dde"
                            icon={<Activity className="h-4 w-4" />}
                            label="DDE"
                            active={pathname === "/dms/dde"}
                            collapsed={isCollapsed}
                        />
                        <SidebarItem
                            href="/dms/claims"
                            icon={<FileText className="h-4 w-4" />}
                            label="Claims"
                            active={pathname === "/dms/claims"}
                            collapsed={isCollapsed}
                        />
                        <SidebarItem
                            href="/dms/pecos"
                            icon={<ShieldCheck className="h-4 w-4" />}
                            label="PECOS"
                            active={pathname === "/dms/pecos"}
                            collapsed={isCollapsed}
                        />
                        <SidebarItem
                            href="/dms/smartdde"
                            icon={<Cpu className="h-4 w-4" />}
                            label="SmartDDE"
                            active={pathname === "/dms/smartdde"}
                            collapsed={isCollapsed}
                        />
                        <SidebarItem
                            href="/samesimilar"
                            icon={<Table2 className="h-4 w-4" />}
                            label="Same or Similar"
                            active={pathname === "/samesimilar"}
                            collapsed={isCollapsed}
                        />
                        <SidebarItem
                            href="/dms/mbi-lookup"
                            icon={<Search className="h-4 w-4" />}
                            label="MBI Lookup"
                            active={pathname === "/dms/mbi-lookup"}
                            collapsed={isCollapsed}
                        />
                    </div>

                    <div className="space-y-1">
                        {!isCollapsed && (
                            <h2 className="mb-2 px-4 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                                CRM & Sales
                            </h2>
                        )}
                        <SidebarCollapsibleItem
                            icon={<Users className="h-4 w-4" />}
                            label="Customers"
                            collapsed={isCollapsed}
                            active={pathname.startsWith("/customers")}
                        >
                            <SidebarItem
                                href="/customers/clients"
                                icon={<div className="w-1 h-1 rounded-full bg-slate-400" />}
                                label="Clients"
                                active={pathname === "/customers/clients"}
                                collapsed={isCollapsed}
                                isSubItem
                            />
                            <SidebarItem
                                href="/customers/users"
                                icon={<div className="w-1 h-1 rounded-full bg-slate-400" />}
                                label="Client Users"
                                active={pathname === "/customers/users"}
                                collapsed={isCollapsed}
                                isSubItem
                            />
                        </SidebarCollapsibleItem>
                        <SidebarItem
                            href="/tasks"
                            icon={<CheckSquare className="h-4 w-4" />}
                            label="Tasks"
                            active={pathname === "/tasks"}
                            collapsed={isCollapsed}
                        />
                        <SidebarItem
                            href="/leads"
                            icon={<PhoneIncoming className="h-4 w-4" />}
                            label="Leads"
                            active={pathname === "/leads"}
                            collapsed={isCollapsed}
                        />
                        <SidebarCollapsibleItem
                            icon={<Wallet className="h-4 w-4" />}
                            label="Sales"
                            collapsed={isCollapsed}
                            active={pathname.startsWith("/sales")}
                        >
                            <SidebarItem
                                href="/sales/invoices"
                                icon={<div className="w-1 h-1 rounded-full bg-slate-400" />}
                                label="Invoices"
                                active={pathname === "/sales/invoices"}
                                collapsed={isCollapsed}
                                isSubItem
                            />
                            <SidebarItem
                                href="/sales/payments"
                                icon={<div className="w-1 h-1 rounded-full bg-slate-400" />}
                                label="Payments"
                                active={pathname === "/sales/payments"}
                                collapsed={isCollapsed}
                                isSubItem
                            />
                            <SidebarItem
                                href="/sales/estimates"
                                icon={<div className="w-1 h-1 rounded-full bg-slate-400" />}
                                label="Estimates"
                                active={pathname === "/sales/estimates"}
                                collapsed={isCollapsed}
                                isSubItem
                            />
                            <SidebarItem
                                href="/sales/subscriptions"
                                icon={<div className="w-1 h-1 rounded-full bg-slate-400" />}
                                label="Subscriptions"
                                active={pathname === "/sales/subscriptions"}
                                collapsed={isCollapsed}
                                isSubItem
                            />
                            <SidebarItem
                                href="/sales/products"
                                icon={<div className="w-1 h-1 rounded-full bg-slate-400" />}
                                label="Products"
                                active={pathname === "/sales/products"}
                                collapsed={isCollapsed}
                                isSubItem
                            />
                            <SidebarItem
                                href="/sales/expenses"
                                icon={<div className="w-1 h-1 rounded-full bg-slate-400" />}
                                label="Expenses"
                                active={pathname === "/sales/expenses"}
                                collapsed={isCollapsed}
                                isSubItem
                            />
                        </SidebarCollapsibleItem>
                    </div>

                    <div className="space-y-1">
                        {!isCollapsed && (
                            <h2 className="mb-2 px-4 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                                Documentation
                            </h2>
                        )}
                        <SidebarCollapsibleItem
                            icon={<Bookmark className="h-4 w-4" />}
                            label="Proposals"
                            collapsed={isCollapsed}
                            active={pathname.startsWith("/proposals")}
                        >
                            <SidebarItem
                                href="/proposals/list"
                                icon={<div className="w-1 h-1 rounded-full bg-slate-400" />}
                                label="Proposals"
                                active={pathname === "/proposals/list"}
                                collapsed={isCollapsed}
                                isSubItem
                            />
                            <SidebarItem
                                href="/proposals/templates"
                                icon={<div className="w-1 h-1 rounded-full bg-slate-400" />}
                                label="Templates"
                                active={pathname === "/proposals/templates"}
                                collapsed={isCollapsed}
                                isSubItem
                            />
                        </SidebarCollapsibleItem>
                        <SidebarItem
                            href="/contracts"
                            icon={<FileSignature className="h-4 w-4" />}
                            label="Contracts"
                            active={pathname === "/contracts"}
                            collapsed={isCollapsed}
                        />
                    </div>

                    <div className="space-y-1">
                        {!isCollapsed && (
                            <h2 className="mb-2 px-4 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                                Operations
                            </h2>
                        )}
                        <SidebarCollapsibleItem
                            icon={<MessageSquare className="h-4 w-4" />}
                            label="Support"
                            collapsed={isCollapsed}
                            active={pathname.startsWith("/support")}
                        >
                            <SidebarItem
                                href="/support/tickets"
                                icon={<div className="w-1 h-1 rounded-full bg-slate-400" />}
                                label="Tickets"
                                active={pathname === "/support/tickets"}
                                collapsed={isCollapsed}
                                isSubItem
                            />
                            <SidebarItem
                                href="/support/canned"
                                icon={<div className="w-1 h-1 rounded-full bg-slate-400" />}
                                label="Canned"
                                active={pathname === "/support/canned"}
                                collapsed={isCollapsed}
                                isSubItem
                            />
                            <SidebarItem
                                href="/support/knowledgebase"
                                icon={<div className="w-1 h-1 rounded-full bg-slate-400" />}
                                label="Knowledgebase"
                                active={pathname === "/support/knowledgebase"}
                                collapsed={isCollapsed}
                                isSubItem
                            />
                            <SidebarItem
                                href="/support/messages"
                                icon={<div className="w-1 h-1 rounded-full bg-slate-400" />}
                                label="Messages"
                                active={pathname === "/support/messages"}
                                collapsed={isCollapsed}
                                isSubItem
                            />
                        </SidebarCollapsibleItem>
                        <SidebarItem
                            href="/chat"
                            icon={<MessageSquare className="h-4 w-4" />}
                            label="Chat Room"
                            active={pathname === "/chat"}
                            collapsed={isCollapsed}
                        />
                        <SidebarItem
                            href="/team"
                            icon={<User className="h-4 w-4" />}
                            label="Team"
                            active={pathname === "/team"}
                            collapsed={isCollapsed}
                        />
                        <SidebarItem
                            href="/reports"
                            icon={<BarChart3 className="h-4 w-4" />}
                            label="Reports"
                            active={pathname === "/reports"}
                            collapsed={isCollapsed}
                        />
                    </div>

                    <div className="space-y-1">
                        {!isCollapsed && (
                            <h2 className="mb-2 px-4 text-xs font-semibold tracking-wider text-slate-400 uppercase">
                                System
                            </h2>
                        )}
                        <SidebarItem
                            href="/admin/backups"
                            icon={<Database className="h-4 w-4" />}
                            label="Backups"
                            active={pathname === "/admin/backups"}
                            collapsed={isCollapsed}
                        />
                        <SidebarItem
                            href="/settings"
                            icon={<Settings className="h-4 w-4" />}
                            label="Settings"
                            active={pathname === "/settings"}
                            collapsed={isCollapsed}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

function SidebarCollapsibleItem({
    icon,
    label,
    collapsed,
    active,
    children
}: {
    icon: React.ReactNode
    label: string
    collapsed: boolean
    active: boolean
    children: React.ReactNode
}) {
    const [isOpen, setIsOpen] = React.useState(active)

    React.useEffect(() => {
        if (active) setIsOpen(true)
    }, [active])

    return (
        <div className="space-y-1">
            <Button
                variant={active && !isOpen ? "secondary" : "ghost"}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full transition-all duration-200",
                    collapsed ? "justify-center px-0" : "justify-start px-4",
                    active && !isOpen ? "bg-amber-100/50 text-slate-900 hover:bg-red-600 hover:text-white" : "text-slate-900 hover:bg-red-600 hover:text-white transition-colors duration-200"
                )}
                title={collapsed ? label : undefined}
            >
                <div className="flex items-center w-full">
                    <span className={cn(
                        "shrink-0",
                        active ? "text-amber-600" : "text-slate-900"
                    )}>
                        {icon}
                    </span>
                    {!collapsed && (
                        <>
                            <span className={cn(
                                "ml-3 truncate font-semibold flex-1 text-left",
                                active ? "text-slate-900" : "text-slate-900"
                            )}>{label}</span>
                            <ChevronDown className={cn(
                                "h-4 w-4 transition-transform duration-200 text-slate-400",
                                isOpen && "rotate-180"
                            )} />
                        </>
                    )}
                </div>
            </Button>
            {!collapsed && isOpen && (
                <div className="space-y-1 animate-in slide-in-from-top-2 duration-200">
                    {children}
                </div>
            )}
        </div>
    )
}

function SidebarItem({
    href,
    icon,
    label,
    active,
    collapsed,
    isSubItem = false
}: {
    href: string
    icon: React.ReactNode
    label: string
    active: boolean
    collapsed: boolean
    isSubItem?: boolean
}) {
    return (
        <Button
            variant={active ? "secondary" : "ghost"}
            asChild
            className={cn(
                "w-full transition-all duration-200",
                collapsed ? "justify-center px-0" : "justify-start",
                isSubItem ? "pl-11 pr-4 h-9" : "px-4",
                active ? "bg-amber-100/50 text-slate-900 hover:bg-red-600 hover:text-white" : "text-slate-900 hover:bg-red-600 hover:text-white transition-colors duration-200"
            )}
            title={collapsed ? label : undefined}
        >
            <Link href={href} className="flex items-center w-full">
                <span className={cn(
                    "shrink-0",
                    active ? "text-amber-600" : "text-slate-900"
                )}>
                    {icon}
                </span>
                {!collapsed && (
                    <span className={cn(
                        "ml-3 truncate font-semibold",
                        active ? "text-slate-900" : "text-slate-900",
                        isSubItem && "text-sm font-medium"
                    )}>{label}</span>
                )}
            </Link>
        </Button>
    )
}
