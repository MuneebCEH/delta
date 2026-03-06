"use client"

import * as React from "react"
import Link from "next/link"
import {
    Search,
    FileText,
    RefreshCcw,
    ExternalLink,
    Info,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Phone,
    HelpCircle,
    PlayCircle,
    ShieldCheck,
    Globe,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    ArrowUpRight,
    ChevronDown,
    Activity,
    ClipboardCheck,
    Cpu,
    Check,
    ArrowLeft
} from "lucide-react"
import { AutomationStatus } from "@/components/automation-status"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export default function SameSimilarPage() {
    const tabs = ["Individual Check", "Batch Mode", "Help", "SNS Chart", "Quick Video Tour"]

    const sampleData = [
        { name: "bland, diana", mbi: "3UR7YN0MD64", dob: "12/04/1942", hcpcs: "L", date: "02/13/26 12:49 PM", found: "No Claim History found", report: "Yes", mac: "CGS C" },
        { name: "higgs, anthony", mbi: "2XD3XV7NN81", dob: "10/30/1959", hcpcs: "L", date: "02/13/26 12:37 PM", found: "No Claim History found", report: "Yes", mac: "CGS C" },
        { name: "tittle, sharon", mbi: "2QF4RV7GR86", dob: "05/08/1958", hcpcs: "L", date: "02/13/26 12:27 PM", found: "No Claim History found", report: "Yes", mac: "CGS C" },
        { name: "day, otis", mbi: "3A86A98HD79", dob: "08/05/1939", hcpcs: "L", date: "02/13/26 12:17 PM", found: "No Claim History found", report: "Yes", mac: "CGS C" },
        { name: "manganiello, ann", mbi: "1JX5D68QY65", dob: "07/21/1955", hcpcs: "L", date: "02/13/26 11:48 AM", found: "No Claim History found", report: "Yes", mac: "Noridian A" },
        { name: "chandler, jane", mbi: "1KD4WD8CU76", dob: "10/13/1941", hcpcs: "E", date: "02/13/26 11:08 AM", found: "No Claim History found", report: "Yes", mac: "Noridian A" },
    ]

    return (
        <div className="flex flex-col h-full bg-slate-50 overflow-hidden font-sans">
            {/* Top Bar matching image */}
            <div className="flex items-center justify-between px-6 py-2 bg-white border-b text-sm">
                <div className="flex items-center space-x-4">
                    <AutomationStatus />
                    <div className="flex items-center text-blue-600 font-medium ml-2">
                        <Phone className="h-4 w-4 mr-1 text-slate-400" />
                        (409) 404-0823
                    </div>
                </div>
                <div className="flex items-center space-x-6 text-slate-600">
                    <button className="flex items-center hover:text-red-600 transition-colors">Free Tools <ChevronDown className="h-3 w-3 ml-1" /></button>
                    <button className="hover:text-red-600 transition-colors">NPI Lookup</button>
                    <button className="hover:text-red-600 transition-colors">eZshare</button>
                    <button className="flex items-center hover:text-red-600 transition-colors">More <ChevronDown className="h-3 w-3 ml-1" /></button>
                    <button className="flex items-center hover:text-red-600 transition-colors"><Settings className="h-4 w-4 mr-1" /> Settings</button>
                    <button className="flex items-center hover:text-red-600 font-semibold text-slate-500 transition-colors"><LogOut className="h-4 w-4 mr-1" /> Sign out</button>
                </div>
            </div>

            <div className="p-6 flex-1 overflow-auto">
                <div className="max-w-[1400px] mx-auto space-y-6">
                    {/* Header Section */}
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Same or Similar</h1>
                            <span className="text-slate-500 text-sm font-medium mt-2">
                                Allows providers/suppliers to check for Same or Similar. Live results from CMS.
                            </span>
                        </div>
                    </div>

                    {/* Toolbar / Search Section */}
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex bg-slate-200 p-1 rounded-md mb-2 md:mb-0">
                            {tabs.map((tab) => (
                                tab === "Individual Check" ? (
                                    <Link
                                        key={tab}
                                        href="/samesimilar/individual-check"
                                        className="px-4 py-1.5 text-sm font-bold transition-all rounded bg-red-600 text-black hover:bg-red-700 hover:text-black"
                                    >
                                        {tab}
                                    </Link>
                                ) : (
                                    <button
                                        key={tab}
                                        className="px-4 py-1.5 text-sm font-bold transition-all rounded text-slate-700 hover:bg-red-600 hover:text-black"
                                    >
                                        {tab}
                                    </button>
                                )
                            ))}
                        </div>
                        <div className="flex-1 flex gap-2 justify-end">
                            <div className="relative w-full max-w-sm">
                                <Input
                                    placeholder="Search Past Checks..."
                                    className="bg-white border-slate-300 focus-visible:ring-blue-600 h-9 rounded-sm"
                                />
                            </div>
                            <Button className="bg-[#f0f0f0] hover:bg-red-600 hover:text-black text-slate-800 border-slate-300 border h-9 font-bold px-6 transition-colors duration-200 rounded-sm">
                                Search
                            </Button>
                        </div>
                    </div>

                    {/* Instruction with Mock Arrow */}
                    <div className="relative pl-12 py-4">
                        <div className="absolute left-0 top-0">
                            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-slate-400 transform rotate-45">
                                <path d="M5 35L35 5M35 5H15M35 5V25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium text-slate-700 mb-1">
                            Click on this button to check a patient/beneficiary.
                        </p>
                        <p className="text-xs text-slate-500 italic">Below are sample reports.</p>
                    </div>

                    {/* Main Table */}
                    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-red-600 hover:bg-red-700">
                                    <TableHead className="text-black font-bold h-10 px-2 text-xs">PDF Report</TableHead>
                                    <TableHead className="text-black font-bold h-10 px-2 text-xs">Check Again</TableHead>
                                    <TableHead className="text-black font-bold h-10 px-2 text-xs">Date</TableHead>
                                    <TableHead className="text-black font-bold h-10 px-2 text-xs">Beneficiary Name / Medicare# / MBI</TableHead>
                                    <TableHead className="text-black font-bold h-10 px-2 text-xs">DOB / Search by HCPCS</TableHead>
                                    <TableHead className="text-black font-bold h-10 px-2 text-xs">Same or Similar Found</TableHead>
                                    <TableHead className="text-black font-bold h-10 px-2 text-xs">Report Found / MAC</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sampleData.map((row, i) => (
                                    <TableRow key={i} className="hover:bg-red-50 border-b border-slate-100 transition-colors duration-150">
                                        <TableCell className="p-2 text-center">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 border border-slate-200 hover:bg-red-600 hover:text-black transition-colors duration-200">
                                                <FileText className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                        <TableCell className="p-2 text-center">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 border border-slate-200 hover:bg-red-600 hover:text-black transition-colors duration-200">
                                                <RefreshCcw className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                        <TableCell className="p-2 text-xs whitespace-nowrap text-slate-600">
                                            <div className="flex flex-col">
                                                <span className="font-bold">{row.date.split(' ')[0]}</span>
                                                <span>{row.date.split(' ').slice(1).join(' ')}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-2 py-3">
                                            <div className="flex flex-col">
                                                <span className="text-blue-600 font-bold text-sm leading-tight hover:underline cursor-pointer">{row.name}</span>
                                                <span className="text-slate-600 font-medium text-xs">
                                                    {row.mbi}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-2">
                                            <div className="flex flex-col text-slate-600 text-xs font-medium">
                                                <span className="font-bold">{row.dob}</span>
                                                <span className="text-slate-800">{row.hcpcs}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-2">
                                            <div className="flex items-center text-xs font-bold text-slate-700">
                                                <Check className="h-4 w-4 text-green-600 mr-2 border border-green-600 rounded-sm" />
                                                {row.found}
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-2">
                                            <div className="flex flex-col text-xs font-bold">
                                                <span className="text-slate-700">{row.report}</span>
                                                <span className="text-slate-500">{row.mac}</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-start gap-1 py-1 px-1 overflow-x-auto pb-4">
                        <Button variant="ghost" className="h-8 px-3 text-black bg-red-600 hover:bg-red-700 border border-red-700 font-bold text-xs rounded-sm transition-colors duration-200">1</Button>
                        <Button variant="ghost" className="h-8 px-3 bg-white text-red-600 hover:bg-red-600 hover:text-black border border-slate-300 font-bold text-xs rounded-sm shadow-sm transition-all duration-200">2</Button>
                        <Button variant="ghost" className="h-8 px-3 bg-white text-red-600 hover:bg-red-600 hover:text-black border border-slate-300 font-bold text-xs rounded-sm shadow-sm transition-all duration-200">3</Button>
                        <Button variant="ghost" className="h-8 px-3 bg-white text-red-600 hover:bg-red-600 hover:text-black border border-slate-300 font-bold text-xs rounded-sm shadow-sm transition-all duration-200">4</Button>
                        <Button variant="ghost" className="h-8 px-3 bg-white text-red-600 hover:bg-red-600 hover:text-black border border-slate-300 font-bold text-xs rounded-sm shadow-sm transition-all duration-200">5</Button>
                        <Button variant="ghost" className="h-8 px-3 bg-white text-red-600 hover:bg-red-600 hover:text-black border border-slate-300 font-bold text-xs rounded-sm shadow-sm transition-all duration-200">6</Button>
                        <Button variant="ghost" className="h-8 px-3 bg-white text-red-600 hover:bg-red-600 hover:text-black border border-slate-300 font-bold text-xs rounded-sm shadow-sm transition-all duration-200">7</Button>
                        <Button variant="ghost" className="h-8 px-3 bg-white text-red-600 hover:bg-red-600 hover:text-black border border-slate-300 font-bold text-xs rounded-sm shadow-sm transition-all duration-200">Last</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
