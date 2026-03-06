"use client"

import * as React from "react"
import Link from "next/link"
import {
    Phone,
    ChevronDown,
    Settings,
    LogOut,
} from "lucide-react"
import { AutomationStatus } from "@/components/automation-status"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export default function IndividualCheckPage() {
    const tabs = ["Go back to Main Page", "Batch Mode", "Help", "SNS Chart", "Quick Video Tour"]

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
                                Checks if beneficiary has Claim History that is Same or Similar within the past 5 years
                            </span>
                        </div>
                    </div>

                    {/* Toolbar Section */}
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex bg-slate-200 p-1 rounded-md mb-2 md:mb-0">
                            {tabs.map((tab) => (
                                tab === "Go back to Main Page" ? (
                                    <Link
                                        key={tab}
                                        href="/samesimilar"
                                        className="px-4 py-1.5 text-sm font-bold bg-red-600 text-black shadow-sm hover:bg-red-700 transition-all rounded"
                                    >
                                        {tab}
                                    </Link>
                                ) : (
                                    <button
                                        key={tab}
                                        className="px-4 py-1.5 text-sm font-bold text-slate-700 hover:bg-red-600 hover:text-black transition-all rounded"
                                    >
                                        {tab}
                                    </button>
                                )
                            ))}
                        </div>
                    </div>

                    {/* Form Layout matching user screenshot */}
                    <div className="max-w-5xl mx-auto pt-4 space-y-10 animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="space-y-10 bg-white p-14 rounded-2xl shadow-lg border border-slate-100">
                            <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-8">
                                <Label className="md:col-span-4 text-right pr-8 font-bold text-slate-800 text-xl">MBI</Label>
                                <Input
                                    placeholder="Enter MBI"
                                    className="md:col-span-8 h-14 text-2xl border-slate-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 rounded-xl shadow-sm bg-white placeholder:text-slate-300 placeholder:text-2xl px-6"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-8">
                                <Label className="md:col-span-4 text-right pr-8 font-bold text-slate-800 text-xl">First Name</Label>
                                <Input
                                    placeholder="Enter First Name"
                                    className="md:col-span-8 h-14 text-2xl border-slate-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 rounded-xl shadow-sm bg-white placeholder:text-slate-300 placeholder:text-2xl px-6"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-8">
                                <Label className="md:col-span-4 text-right pr-8 font-bold text-slate-800 text-xl">Last Name</Label>
                                <Input
                                    placeholder="Enter Last Name"
                                    className="md:col-span-8 h-14 text-2xl border-slate-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 rounded-xl shadow-sm bg-white placeholder:text-slate-300 placeholder:text-2xl px-6"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-8">
                                <Label className="md:col-span-4 text-right pr-8 font-bold text-slate-800 text-xl">DOB</Label>
                                <Input
                                    placeholder="mmddyyyy"
                                    className="md:col-span-8 h-14 text-2xl border-slate-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 rounded-xl shadow-sm italic text-slate-500 bg-white placeholder:text-2xl px-6"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-12 items-start gap-8">
                                <Label className="md:col-span-4 text-right pr-8 font-bold text-slate-800 text-xl pt-3">MAC or State</Label>
                                <div className="md:col-span-8 space-y-4">
                                    <Select>
                                        <SelectTrigger className="h-14 text-2xl border-slate-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 rounded-xl shadow-sm bg-white text-slate-900 !bg-white px-6">
                                            <SelectValue placeholder="Please select..." className="placeholder:text-2xl" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white !bg-white z-[100] shadow-2xl border border-slate-200 max-h-[400px] overflow-y-auto !text-slate-900">
                                            <SelectItem value="cgs-b" className="text-xl py-3">CGS - Juris B</SelectItem>
                                            <SelectItem value="cgs-c" className="text-xl py-3">CGS - Juris C</SelectItem>
                                            <SelectItem value="nord-a" className="text-xl py-3">Noridian - Juris A</SelectItem>
                                            <SelectItem value="nord-d" className="text-xl py-3">Noridian - Juris D</SelectItem>
                                            <SelectItem value="AL" className="text-xl py-3">Alabama - AL</SelectItem>
                                            <SelectItem value="AK" className="text-xl py-3">Alaska - AK</SelectItem>
                                            <SelectItem value="AZ" className="text-xl py-3">Arizona - AZ</SelectItem>
                                            <SelectItem value="AR" className="text-xl py-3">Arkansas - AR</SelectItem>
                                            <SelectItem value="AS" className="text-xl py-3">American Samoa - AS</SelectItem>
                                            <SelectItem value="CA" className="text-xl py-3">California - CA</SelectItem>
                                            <SelectItem value="CO" className="text-xl py-3">Colorado - CO</SelectItem>
                                            <SelectItem value="CT" className="text-xl py-3">Connecticut - CT</SelectItem>
                                            <SelectItem value="DE" className="text-xl py-3">Delaware - DE</SelectItem>
                                            <SelectItem value="DC" className="text-xl py-3">District of Columbia - DC</SelectItem>
                                            <SelectItem value="FL" className="text-xl py-3">Florida - FL</SelectItem>
                                            <SelectItem value="GA" className="text-xl py-3">Georgia - GA</SelectItem>
                                            <SelectItem value="GU" className="text-xl py-3">Guam - GU</SelectItem>
                                            <SelectItem value="HI" className="text-xl py-3">Hawaii - HI</SelectItem>
                                            <SelectItem value="ID" className="text-xl py-3">Idaho - ID</SelectItem>
                                            <SelectItem value="IL" className="text-xl py-3">Illinois - IL</SelectItem>
                                            <SelectItem value="IN" className="text-xl py-3">Indiana - IN</SelectItem>
                                            <SelectItem value="IA" className="text-xl py-3">Iowa - IA</SelectItem>
                                            <SelectItem value="KS" className="text-xl py-3">Kansas - KS</SelectItem>
                                            <SelectItem value="KY" className="text-xl py-3">Kentucky - KY</SelectItem>
                                            <SelectItem value="LA" className="text-xl py-3">Louisiana - LA</SelectItem>
                                            <SelectItem value="ME" className="text-xl py-3">Maine - ME</SelectItem>
                                            <SelectItem value="MD" className="text-xl py-3">Maryland - MD</SelectItem>
                                            <SelectItem value="MA" className="text-xl py-3">Massachusetts - MA</SelectItem>
                                            <SelectItem value="MI" className="text-xl py-3">Michigan - MI</SelectItem>
                                            <SelectItem value="MN" className="text-xl py-3">Minnesota - MN</SelectItem>
                                            <SelectItem value="MS" className="text-xl py-3">Mississippi - MS</SelectItem>
                                            <SelectItem value="MO" className="text-xl py-3">Missouri - MO</SelectItem>
                                            <SelectItem value="MT" className="text-xl py-3">Montana - MT</SelectItem>
                                            <SelectItem value="NE" className="text-xl py-3">Nebraska - NE</SelectItem>
                                            <SelectItem value="NV" className="text-xl py-3">Nevada - NV</SelectItem>
                                            <SelectItem value="NH" className="text-xl py-3">New Hampshire - NH</SelectItem>
                                            <SelectItem value="NJ" className="text-xl py-3">New Jersey - NJ</SelectItem>
                                            <SelectItem value="NM" className="text-xl py-3">New Mexico - NM</SelectItem>
                                            <SelectItem value="NY" className="text-xl py-3">New York - NY</SelectItem>
                                            <SelectItem value="NC" className="text-xl py-3">North Carolina - NC</SelectItem>
                                            <SelectItem value="ND" className="text-xl py-3">North Dakota - ND</SelectItem>
                                            <SelectItem value="OH" className="text-xl py-3">Ohio - OH</SelectItem>
                                            <SelectItem value="OK" className="text-xl py-3">Oklahoma - OK</SelectItem>
                                            <SelectItem value="OR" className="text-xl py-3">Oregon - OR</SelectItem>
                                            <SelectItem value="PA" className="text-xl py-3">Pennsylvania - PA</SelectItem>
                                            <SelectItem value="PR" className="text-xl py-3">Puerto Rico - PR</SelectItem>
                                            <SelectItem value="RI" className="text-xl py-3">Rhode Island - RI</SelectItem>
                                            <SelectItem value="SC" className="text-xl py-3">South Carolina - SC</SelectItem>
                                            <SelectItem value="SD" className="text-xl py-3">South Dakota - SD</SelectItem>
                                            <SelectItem value="TN" className="text-xl py-3">Tennessee - TN</SelectItem>
                                            <SelectItem value="TX" className="text-xl py-3">Texas - TX</SelectItem>
                                            <SelectItem value="UT" className="text-xl py-3">Utah - UT</SelectItem>
                                            <SelectItem value="VI" className="text-xl py-3">U.S. Virgin Islands - VI</SelectItem>
                                            <SelectItem value="VT" className="text-xl py-3">Vermont - VT</SelectItem>
                                            <SelectItem value="VA" className="text-xl py-3">Virginia - VA</SelectItem>
                                            <SelectItem value="WA" className="text-xl py-3">Washington - WA</SelectItem>
                                            <SelectItem value="WV" className="text-xl py-3">West Virginia - WV</SelectItem>
                                            <SelectItem value="WI" className="text-xl py-3">Wisconsin - WI</SelectItem>
                                            <SelectItem value="WY" className="text-xl py-3">Wyoming - WY</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <p className="text-sm text-slate-500 leading-normal">
                                        State is determined by the patients home address obtained from the HETS Eligibility report. <Link href="/dms/eligibility" className="text-blue-600 hover:underline">Check Eligibility here.</Link>
                                    </p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-12 items-start gap-8 pt-2">
                                <Label className="md:col-span-4 text-right pr-8 font-bold text-slate-800 text-xl pt-3">HCPCS</Label>
                                <div className="md:col-span-8 space-y-4">
                                    <Input
                                        placeholder="L or L1906"
                                        className="h-14 text-2xl border-slate-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 rounded-xl shadow-sm italic text-slate-500 bg-white placeholder:text-2xl px-6"
                                    />
                                    <div className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-xl border border-slate-100">
                                        <span className="font-bold text-slate-700">New!</span> You can now enter multiple HCPCS codes. Example: K1000, L, E <br />
                                        <span className="font-bold text-slate-700">Note:</span> Each code will deduct an SNS check.
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-6">
                                <div className="md:col-span-4" />
                                <Button className="md:col-span-8 bg-red-600 hover:bg-red-700 text-black font-black h-16 rounded-xl text-xl shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]">
                                    Check Beneficiary
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
