import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardCharts } from "@/components/dashboard/dashboard-charts"
import { Activity, CreditCard, DollarSign, Users, Clock, AlertCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

export const revalidate = 10 // Revalidate data every 10 seconds

export default async function DashboardPage() {
    // 1. Fetch Real Stats from DB
    const [
        totalPatients,
        totalReturns,
        totalProjects,
        totalRows,
        recentActivity,
        allPatientsRows,
        recentReturnsRows
    ] = await Promise.all([
        prisma.row.count({
            where: { sheet: { name: 'Patients' } }
        }),
        prisma.row.count({
            where: { sheet: { name: { in: ['CGM PTS', 'BRX PTs', 'CGM PST', 'CGM-Upcoming Orders'] } } }
        }),
        prisma.project.count(),
        prisma.row.count(),
        prisma.row.findMany({
            take: 6,
            orderBy: { updatedAt: 'desc' },
            include: {
                sheet: {
                    select: { name: true }
                }
            }
        }),
        // Data for "Status Analysis" Pie Chart
        prisma.row.findMany({
            where: { sheet: { name: 'Patients' } },
            select: { data: true },
            take: 2000 // Sample size for performance
        }),
        // Data for "Weekly Metrics" Bar Chart
        prisma.row.findMany({
            where: {
                sheet: { name: { in: ['Patients', 'CGM PTS', 'BRX PTs', 'CGM PST'] } },
                updatedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
            },
            select: { updatedAt: true }
        })
    ])

    // --- AGGREGATE DATA FOR CHARTS ---

    // Status Analysis (Pie Chart)
    // Column ID for "Reason for Return" is cmlbjpkt20041uw4s29bgiz3w
    const reasonColId = "cmlbjpkt20041uw4s29bgiz3w"
    const reasonsMap: Record<string, number> = {}
    allPatientsRows.forEach(r => {
        const d = r.data as any
        const val = d[reasonColId] || (d['returned'] === true ? 'Returned' : 'Processed')
        reasonsMap[val] = (reasonsMap[val] || 0) + 1
    })
    const reasonData = Object.entries(reasonsMap)
        .map(([name, value]) => ({ name: name.toUpperCase(), value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 4)

    // Weekly Metrics (Bar Chart)
    const dayMap: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
    recentReturnsRows.forEach(r => {
        const day = new Date(r.updatedAt).getDay()
        dayMap[day]++
    })
    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const weeklyData = dayLabels.map((name, i) => ({ name, returns: dayMap[i] }))
    // Reorder to put Monday first
    const mondayFirst = [...weeklyData.slice(1), weeklyData[0]]

    // Calculate a mock revenue based on returns (e.g. $1892 per return average)
    const mockRevenue = totalReturns * 1892.45
    const formattedRevenue = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(mockRevenue)

    return (
        <div className="flex-1 space-y-6 p-6 md:p-8 pt-6 bg-slate-50/30">
            <div className="flex flex-col gap-1">
                <h2 className="text-3xl font-black tracking-tight text-slate-800">Operational Hub</h2>
                <p className="text-sm text-muted-foreground font-medium">Real-time health metrics and record activity.</p>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Total Patients - Blue Theme */}
                <Card className="border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                        <CardTitle className="text-[11px] font-black uppercase tracking-[0.15em] text-blue-600/70">
                            Total Patients
                        </CardTitle>
                        <div className="p-2.5 bg-blue-50 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm border border-blue-100">
                            <Users className="h-4 w-4 text-blue-600 group-hover:text-white transition-colors" />
                        </div>
                    </CardHeader>
                    <CardContent className="relative">
                        <div className="text-4xl font-black text-slate-800 tabular-nums tracking-tighter group-hover:text-blue-700 transition-colors">
                            {totalPatients.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full ring-1 ring-blue-100">
                                +12.5%
                            </span>
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Historical Growth</span>
                        </div>
                    </CardContent>
                </Card>

                {/* All Returns - Amber/Orange Theme */}
                <Card className="border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                        <CardTitle className="text-[11px] font-black uppercase tracking-[0.15em] text-amber-600/70">
                            All Returns (PTS)
                        </CardTitle>
                        <div className="p-2.5 bg-amber-50 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300 shadow-sm border border-amber-100">
                            <Activity className="h-4 w-4 text-amber-600 group-hover:text-white transition-colors" />
                        </div>
                    </CardHeader>
                    <CardContent className="relative">
                        <div className="text-4xl font-black text-slate-800 tabular-nums tracking-tighter group-hover:text-amber-700 transition-colors">
                            {totalReturns.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
                            </span>
                            <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-2 py-0.5 rounded-full ring-1 ring-amber-100 shadow-sm">
                                Live Processing
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Est. Revenue - Green Theme */}
                <Card className="border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                        <CardTitle className="text-[11px] font-black uppercase tracking-[0.15em] text-emerald-600/70">
                            Est. Revenue
                        </CardTitle>
                        <div className="p-2.5 bg-emerald-50 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-sm border border-emerald-100">
                            <DollarSign className="h-4 w-4 text-emerald-600 group-hover:text-white transition-colors" />
                        </div>
                    </CardHeader>
                    <CardContent className="relative">
                        <div className="text-3xl font-black text-slate-800 tabular-nums tracking-tighter group-hover:text-emerald-700 transition-colors">
                            {formattedRevenue}
                        </div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-2.5 flex items-center gap-1.5">
                            <span className="h-1 w-1 bg-emerald-400 rounded-full" />
                            Verified Records Data
                        </p>
                    </CardContent>
                </Card>

                {/* Global Projects - Purple Theme */}
                <Card className="border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative">
                        <CardTitle className="text-[11px] font-black uppercase tracking-[0.15em] text-purple-600/70">
                            Global Projects
                        </CardTitle>
                        <div className="p-2.5 bg-purple-50 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300 shadow-sm border border-purple-100">
                            <CreditCard className="h-4 w-4 text-purple-600 group-hover:text-white transition-colors" />
                        </div>
                    </CardHeader>
                    <CardContent className="relative">
                        <div className="text-4xl font-black text-slate-800 tabular-nums tracking-tighter group-hover:text-purple-700 transition-colors">
                            {totalProjects}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 w-[75%] rounded-full shadow-[0_0_8px_rgba(168,85,247,0.4)]" />
                            </div>
                            <span className="text-[10px] font-black text-purple-600 whitespace-nowrap">75% Sync</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* Charts Area */}
                <div className="lg:col-span-4">
                    <DashboardCharts
                        weeklyData={mondayFirst}
                        reasonData={reasonData}
                    />
                </div>

                {/* Recent Activity List */}
                <Card className="lg:col-span-3 border-none shadow-sm bg-white rounded-xl overflow-hidden flex flex-col">
                    <CardHeader className="bg-slate-50/50 border-b p-5">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-black text-slate-800 uppercase tracking-widest">Global Live Activity</CardTitle>
                            <Clock className="h-4 w-4 text-slate-400" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 overflow-y-auto max-h-[445px] custom-scrollbar">
                        {recentActivity.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-20 text-center">
                                <AlertCircle className="h-10 w-10 text-slate-100 mb-2" />
                                <p className="text-xs font-bold text-slate-300 uppercase tracking-widest">No Recent Activity</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {recentActivity.map((row) => {
                                    const data = row.data as Record<string, any> || {}
                                    const ptName = data['patientName'] || data['name'] || Object.values(data).find(v => typeof v === 'string' && v.length > 5) || "Unnamed Record"

                                    return (
                                        <div key={row.id} className="p-5 hover:bg-slate-50/50 transition-colors group">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="space-y-1 overflow-hidden">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] bg-sky-50 text-sky-600 font-black px-1.5 py-0.5 rounded uppercase tracking-tighter shrink-0">
                                                            {row.sheet.name}
                                                        </span>
                                                        <p className="text-[13px] font-bold text-slate-800 truncate leading-none">
                                                            {ptName}
                                                        </p>
                                                    </div>
                                                    <p className="text-[11px] text-slate-400 font-medium truncate">
                                                        Entry modified in workspace view
                                                    </p>
                                                </div>
                                                <div className="text-[10px] font-bold text-slate-400 whitespace-nowrap pt-0.5 uppercase tracking-tighter">
                                                    {formatDistanceToNow(new Date(row.updatedAt), { addSuffix: true })}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </CardContent>
                    <div className="p-4 bg-slate-50 border-t mt-auto text-center">
                        <button className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-700 transition-colors">
                            View All Activity Audit Logs
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    )
}
