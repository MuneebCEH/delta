"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from "recharts"

const weeklyData = [
    { name: "Mon", returns: 4 },
    { name: "Tue", returns: 3 },
    { name: "Wed", returns: 7 },
    { name: "Thu", returns: 2 },
    { name: "Fri", returns: 5 },
    { name: "Sat", returns: 1 },
    { name: "Sun", returns: 0 },
]

const reasonData = [
    { name: "Bad State", value: 12 },
    { name: "SNS Failed", value: 8 },
    { name: "No Answer", value: 15 },
    { name: "Refused", value: 5 },
]

const COLORS = ["#ef4444", "#f97316", "#3b82f6", "#10b981"]

export function DashboardCharts() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-6">
            {/* Weekly Returns Chart */}
            <Card className="col-span-4 border border-indigo-100 shadow-sm hover:shadow-xl transition-all duration-500 bg-[#f8faff] group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
                <CardHeader className="relative">
                    <CardTitle className="text-[13px] font-black uppercase tracking-[0.2em] text-indigo-700">
                        Weekly Metrics
                    </CardTitle>
                    <CardDescription className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">
                        Real-time returns processing per day
                    </CardDescription>
                </CardHeader>
                <CardContent className="pl-2 relative">
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={weeklyData}>
                            <XAxis
                                dataKey="name"
                                stroke="#6366f1"
                                fontSize={10}
                                fontWeight={800}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis
                                stroke="#94a3b8"
                                fontSize={10}
                                fontWeight={800}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}`}
                                dx={-5}
                            />
                            <Tooltip
                                cursor={{ fill: '#f1f5f9', opacity: 0.4 }}
                                contentStyle={{
                                    borderRadius: '16px',
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05)',
                                    padding: '12px'
                                }}
                                itemStyle={{ fontWeight: 900, fontSize: '11px', textTransform: 'uppercase' }}
                            />
                            <Bar
                                dataKey="returns"
                                fill="url(#barGradient)"
                                radius={[6, 6, 0, 0]}
                                barSize={40}
                            />
                            <defs>
                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#4f46e5" />
                                    <stop offset="100%" stopColor="#818cf8" />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Return Reasons Pie Chart */}
            <Card className="col-span-3 border border-emerald-100 shadow-sm hover:shadow-xl transition-all duration-500 bg-[#f0fdf4]/80 group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mt-32 blur-3xl transition-transform group-hover:scale-110 duration-700 opacity-50" />
                <CardHeader className="relative">
                    <CardTitle className="text-[13px] font-black uppercase tracking-[0.2em] text-emerald-700">
                        Status Analysis
                    </CardTitle>
                    <CardDescription className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider">
                        Distribution of operational outcomes
                    </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                    <ResponsiveContainer width="100%" height={350}>
                        <PieChart>
                            <Pie
                                data={reasonData}
                                cx="50%"
                                cy="50%"
                                innerRadius={75}
                                outerRadius={100}
                                fill="#8884d8"
                                paddingAngle={8}
                                dataKey="value"
                                stroke="none"
                            >
                                {reasonData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    borderRadius: '16px',
                                    border: '1px solid #e2e8f0',
                                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05)',
                                    padding: '12px'
                                }}
                                itemStyle={{ fontWeight: 900, fontSize: '11px', textTransform: 'uppercase' }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                iconType="circle"
                                wrapperStyle={{
                                    paddingTop: '30px',
                                    fontSize: '10px',
                                    fontWeight: 800,
                                    textTransform: 'uppercase',
                                    color: '#64748b'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}
