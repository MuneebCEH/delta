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
    ChevronDown
} from "lucide-react"
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

export default function EligibilityPage() {
    const [activeTab, setActiveTab] = React.useState("Individual Check")

    const tabs = ["Individual Check", "Batch Mode", "Help", "MAC Helplines", "Quick Video Tour"]

    const sampleData = [
        { name: "hall junior,robert", mbi: "2C74VV6AM65", dob: "08/23/1956", gender: "F", date: "Today 11:18 AM", status: "No", type: "HETS", details: {} },
        { name: "hall,robert", mbi: "2C74VV6AM65", dob: "08/23/1956", gender: "F", date: "Today 11:18 AM", status: "No", type: "HETS", details: {} },
        { name: "junior,robert", mbi: "2C74VV6AM65", dob: "08/23/1956", gender: "F", date: "Today 11:18 AM", status: "No", type: "HETS", details: {} },
        { name: "herbsleb,patricia,a", mbi: "8E64XD4GK63", dob: "05/20/1940", gender: "F", date: "Today 11:18 AM", status: "Yes", type: "HETS", ded: "119.38", details: { partA: true, partB: true, hh: true, msp: true, hmo: true, hosp: true } },
        { name: "panagopoulos,jennie", mbi: "1MW8TT0GQ40", dob: "01/28/1935", gender: "F", date: "Today 11:17 AM", status: "Yes", type: "HETS", ded: "283.00", details: { partA: true, partB: true, hh: true, msp: true, hmo: true, hosp: true } },
        { name: "fisher,madge,e", mbi: "8WJ7GN5VY45", dob: "06/04/1943", gender: "F", date: "Today 11:17 AM", status: "Yes", type: "HETS", ded: "112.68", details: { partA: true, partB: true, hh: true, msp: true, hmo: false, hosp: true } },
        { name: "lusingu,ruth,e", mbi: "5GY0MW8UW35", dob: "09/15/1940", gender: "F", date: "Today 11:17 AM", status: "Yes", type: "HETS", ded: "283.00", details: { partA: true, partB: true, hh: true, msp: true, hmo: true, hosp: true } },
        { name: "mullen,jack,w", mbi: "7V01YX4PC29", dob: "04/14/1951", gender: "M", date: "Today 11:17 AM", status: "Yes", type: "HETS", ded: "0.00", details: { partA: true, partB: true, hh: true, msp: true, hmo: true, hosp: true } },
        { name: "barker,harry,w", mbi: "9K73RW7PA86", dob: "04/11/1945", gender: "M", date: "Today 11:17 AM", status: "Yes", type: "HETS", ded: "0.00", details: { partA: true, partB: true, hh: true, msp: true, hmo: true, hosp: true } },
        { name: "lacour,michael,r", mbi: "5NE3T86NV88", dob: "07/31/1960", gender: "M", date: "Today 11:17 AM", status: "Yes", type: "HETS", ded: "283.00", details: { partA: true, partB: true, hh: true, msp: true, hmo: true, hosp: true } },
    ]

    return (
        <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
            {/* Top Bar matching image */}
            <div className="flex items-center justify-between px-6 py-2 bg-white border-b text-sm">
                <div className="flex items-center space-x-4">
                    <span className="flex items-center text-slate-600 font-medium">
                        HETS Status: <span className="text-green-600 ml-1 font-bold">Online</span>
                    </span>
                    <div className="flex items-center text-blue-600 font-medium">
                        <Phone className="h-4 w-4 mr-1 text-slate-400" />
                        (409) 404-0823
                    </div>
                </div>
                <div className="flex items-center space-x-6 text-slate-600">
                    <button className="flex items-center hover:text-blue-600">Free Tools <ChevronDown className="h-3 w-3 ml-1" /></button>
                    <button className="hover:text-blue-600">NPI Lookup</button>
                    <button className="hover:text-blue-600">eZshare</button>
                    <button className="flex items-center hover:text-blue-600">More <ChevronDown className="h-3 w-3 ml-1" /></button>
                    <button className="flex items-center hover:text-blue-600"><Settings className="h-4 w-4 mr-1" /> Settings</button>
                    <button className="flex items-center hover:text-blue-600 font-semibold text-slate-500"><LogOut className="h-4 w-4 mr-1" /> Sign out</button>
                </div>
            </div>

            <div className="p-6 flex-1 overflow-auto">
                <div className="max-w-[1400px] mx-auto space-y-6">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Medicare Eligibility</h1>
                                <span className="text-slate-500 text-sm font-medium mt-2">
                                    Determine Medicare eligibility for beneficiaries/patients. Live results from CMS.
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Toolbar / Search Section */}
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex bg-slate-200 p-1 rounded-md mb-2 md:mb-0">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={cn(
                                        "px-4 py-1.5 text-sm font-bold transition-all rounded",
                                        activeTab === tab
                                            ? "bg-red-600 text-black shadow-sm hover:bg-red-700"
                                            : "text-slate-700 hover:bg-red-600 hover:text-black"
                                    )}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                        <div className="flex-1 flex gap-2 justify-end">
                            <div className="relative w-full max-w-sm">
                                <Input
                                    placeholder="Search Past Eligibilities..."
                                    className="bg-white border-slate-300 focus-visible:ring-blue-600 h-9"
                                />
                            </div>
                            <Button className="bg-[#f0f0f0] hover:bg-red-600 hover:text-black text-slate-800 border-slate-300 border h-9 font-bold px-6 transition-colors duration-200">
                                Search
                            </Button>
                        </div>
                    </div>

                    {/* Urgent Alert */}
                    <Card className="bg-white border-slate-200 shadow-sm">
                        <CardContent className="p-4 flex items-start gap-4">
                            <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                            <p className="text-sm">
                                <span className="text-red-600 font-bold">Urgent! Eligibility access will be terminated</span>,
                                if you dont complete the HETS attestation that CMS is enforcing in March.
                                You can <Link href="#" className="text-blue-600 underline font-medium mx-1">complete the HETS attestation here</Link>
                                it takes 2 minutes. Source: <span className="text-blue-600 font-medium">CMS Article (updated)</span>
                            </p>
                        </CardContent>
                    </Card>

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
                                    <TableHead className="text-black font-bold h-10 px-2 text-xs">Check SNS</TableHead>
                                    <TableHead className="text-black font-bold h-10 px-2 text-xs text-center whitespace-nowrap">Check Again</TableHead>
                                    <TableHead className="text-black font-bold h-10 px-2 text-xs">Date</TableHead>
                                    <TableHead className="text-black font-bold h-10 px-2 text-xs">Beneficiary Name / MBI</TableHead>
                                    <TableHead className="text-black font-bold h-10 px-2 text-xs">DOB / Gender</TableHead>
                                    <TableHead className="text-black font-bold h-10 px-2 text-xs text-center">PartA</TableHead>
                                    <TableHead className="text-black font-bold h-10 px-2 text-xs text-center">PartB</TableHead>
                                    <TableHead className="text-black font-bold h-10 px-2 text-xs text-center">HH</TableHead>
                                    <TableHead className="text-black font-bold h-10 px-2 text-xs text-center">MSP</TableHead>
                                    <TableHead className="text-black font-bold h-10 px-2 text-xs text-center whitespace-nowrap">HMO /MA</TableHead>
                                    <TableHead className="text-black font-bold h-10 px-2 text-xs text-center">Hosp</TableHead>
                                    <TableHead className="text-black font-bold h-10 px-2 text-xs text-center">PartB Ded.</TableHead>
                                    <TableHead className="text-black font-bold h-10 px-2 text-xs text-center">DOD</TableHead>
                                    <TableHead className="text-black font-bold h-10 px-2 text-xs text-center">Report Found Report Type</TableHead>
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
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                        <TableCell className="p-2 text-center">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 border border-slate-200 hover:bg-red-600 hover:text-black">
                                                <RefreshCcw className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                        <TableCell className="p-2 text-xs whitespace-nowrap text-slate-600">
                                            {row.date}
                                        </TableCell>
                                        <TableCell className="p-2 py-3">
                                            <div className="flex flex-col">
                                                <span className="text-blue-600 font-bold text-sm leading-tight hover:underline cursor-pointer">{row.name}</span>
                                                <span className="text-slate-600 font-medium text-xs flex items-center mt-0.5">
                                                    {row.mbi} <Info className="h-3 w-3 ml-1 text-slate-400" />
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-2">
                                            <div className="flex flex-col text-slate-600 text-xs font-medium">
                                                <span>{row.dob}</span>
                                                <span>{row.gender}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="p-2 text-center">
                                            {row.details.partA && <div className="mx-auto w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white font-extrabold text-[10px]">A</div>}
                                        </TableCell>
                                        <TableCell className="p-2 text-center">
                                            {row.details.partB && <div className="mx-auto w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white font-extrabold text-[10px]">A</div>}
                                        </TableCell>
                                        <TableCell className="p-2 text-center">
                                            {row.details.hh && <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />}
                                        </TableCell>
                                        <TableCell className="p-2 text-center">
                                            {row.details.msp && <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />}
                                        </TableCell>
                                        <TableCell className="p-2 text-center">
                                            {row.details.hmo !== undefined && (row.details.hmo ? <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" /> : <XCircle className="h-5 w-5 text-red-600 mx-auto" strokeWidth={3} />)}
                                        </TableCell>
                                        <TableCell className="p-2 text-center">
                                            {row.details.hosp && <CheckCircle2 className="h-5 w-5 text-green-600 mx-auto" />}
                                        </TableCell>
                                        <TableCell className="p-2 text-center text-xs font-bold text-slate-700">
                                            {row.ded || ""}
                                        </TableCell>
                                        <TableCell className="p-2 text-center text-xs text-slate-400">
                                            {/* DOD empty in sample */}
                                        </TableCell>
                                        <TableCell className="p-2 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className={cn("text-xs font-bold", row.status === "Yes" ? "text-slate-700" : "text-red-600")}>
                                                    {row.status} {row.status === "No" && <HelpCircle className="inline h-3 w-3 mb-0.5" />}
                                                </span>
                                                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">{row.type}</span>
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
                        <Button variant="ghost" className="h-8 px-3 bg-white text-red-600 hover:bg-red-600 hover:text-black border border-slate-300 font-bold text-xs rounded-sm shadow-sm transition-all duration-200">8</Button>
                        <Button variant="ghost" className="h-8 px-3 bg-white text-red-600 hover:bg-red-600 hover:text-black border border-slate-300 font-bold text-xs rounded-sm shadow-sm transition-all duration-200">9</Button>
                        <Button variant="ghost" className="h-8 px-3 bg-white text-red-600 hover:bg-red-600 hover:text-black border border-slate-300 font-bold text-xs rounded-sm shadow-sm transition-all duration-200">10</Button>
                        <Button variant="ghost" className="h-8 px-3 bg-white text-red-600 hover:bg-red-600 hover:text-black border border-slate-300 font-bold text-xs rounded-sm shadow-sm transition-all duration-200">Last</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

