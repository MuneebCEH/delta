"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Check, Layout, Settings2 } from "lucide-react"
import { createProject } from "@/app/actions/projects"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function CreateProjectDialog() {
    const [open, setOpen] = useState(false)
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        configType: "", // Force selection
        sheetName: "Sheet 1",
        numSheets: "1",
        columnNames: ""
    })
    const [isPending, setIsPending] = useState(false)

    const handleNext = () => {
        if (step === 1) {
            if (formData.name.trim()) setStep(2)
        } else if (step === 2) {
            if (formData.configType === "custom") {
                setStep(3)
            } else if (formData.configType === "default") {
                void performSubmission()
            }
        } else if (step === 3) {
            if (formData.sheetName.trim()) setStep(4)
        }
    }

    const handleBack = () => {
        setStep(prev => prev - 1)
    }

    const resetForm = () => {
        setStep(1)
        setIsPending(false)
        setFormData({
            name: "",
            description: "",
            configType: "",
            sheetName: "Sheet 1",
            numSheets: "1",
            columnNames: ""
        })
    }

    const performSubmission = async () => {
        if (isPending) return
        setIsPending(true)
        try {
            const data = new FormData()
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    data.append(key, value.toString())
                }
            })

            await createProject(data)
            setOpen(false)
            resetForm()
        } catch (error) {
            console.error("Failed to create project:", error)
            setIsPending(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault()
            const isFinalStep = step === (formData.configType === "custom" ? 4 : 2)

            // At Step 2, if no configType selected, don't allow Enter
            if (step === 2 && !formData.configType) return

            if (isFinalStep && formData.configType) {
                void performSubmission()
            } else {
                handleNext()
            }
        }
    }

    return (
        <Dialog open={open} onOpenChange={(val) => {
            setOpen(val)
            if (!val) resetForm()
        }}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Create Project
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] bg-white border-none shadow-2xl p-0 overflow-hidden">
                <div className="flex flex-col h-full">
                    <div className="p-8 border-b bg-gray-50/50">
                        <DialogHeader>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                                    STEP {step} OF {formData.configType === "custom" ? "4" : "2"}
                                </span>
                            </div>
                            <DialogTitle className="text-2xl font-bold text-gray-900 leading-tight">
                                {step === 1 && "Start a New Journey"}
                                {step === 2 && "Choose Your Launchpad"}
                                {step === 3 && "Sheet Architecture"}
                                {step === 4 && "Define Your Fields"}
                            </DialogTitle>
                            <DialogDescription className="text-gray-500 mt-1">
                                {step === 1 && "First, let's name your masterpiece. This will be your project's identity."}
                                {step === 2 && "Speed up with a template or build something unique from scratch."}
                                {step === 3 && "Tell us about the structure of your data sheets."}
                                {step === 4 && "What specific columns do you need in your primary sheet?"}
                            </DialogDescription>
                        </DialogHeader>
                    </div>

                    <div className="p-8 max-h-[60vh] overflow-y-auto">
                        {step === 1 && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Project Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. Q1 Logistics Pipeline"
                                        className="h-12 border-gray-200 focus:border-primary focus:ring-primary/20 transition-all text-base"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        onKeyDown={handleKeyDown}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-sm font-semibold text-gray-700">Purpose</Label>
                                    <textarea
                                        id="description"
                                        placeholder="Briefly describe what this project will track..."
                                        className="min-h-[100px] w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        onKeyDown={handleKeyDown}
                                    />
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4">
                                <Label className="text-sm font-semibold text-gray-700">Project Blueprint</Label>
                                <RadioGroup
                                    value={formData.configType}
                                    onValueChange={v => setFormData({ ...formData, configType: v })}
                                    className="grid grid-cols-1 gap-4"
                                >
                                    <div
                                        onClick={() => setFormData({ ...formData, configType: "default" })}
                                        className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer group ${formData.configType === "default"
                                            ? "border-primary bg-primary/[0.03] shadow-inner"
                                            : "border-gray-100 hover:border-gray-300 bg-white"
                                            }`}
                                    >
                                        <div className={`p-3 rounded-xl shadow-sm transition-colors ${formData.configType === "default" ? "bg-primary text-white" : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"}`}>
                                            <Layout className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1 pt-0.5">
                                            <div className="flex items-center justify-between">
                                                <p className="font-bold text-gray-900">Standard Healthcare Template</p>
                                                {formData.configType === "default" && (
                                                    <div className="bg-primary rounded-full p-1">
                                                        <Check className="h-3 w-3 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-[13px] leading-relaxed text-gray-500 mt-1">
                                                Complete ecosystem for medical records. Includes Patients, CGM, BRX, and Call Logs templates pre-configured.
                                            </p>
                                        </div>
                                        <RadioGroupItem value="default" id="default" className="sr-only" />
                                    </div>

                                    <div
                                        onClick={() => setFormData({ ...formData, configType: "custom" })}
                                        className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer group ${formData.configType === "custom"
                                            ? "border-primary bg-primary/[0.03] shadow-inner"
                                            : "border-gray-100 hover:border-gray-300 bg-white"
                                            }`}
                                    >
                                        <div className={`p-3 rounded-xl shadow-sm transition-colors ${formData.configType === "custom" ? "bg-primary text-white" : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"}`}>
                                            <Settings2 className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1 pt-0.5">
                                            <div className="flex items-center justify-between">
                                                <p className="font-bold text-gray-900">Custom Architecture</p>
                                                {formData.configType === "custom" && (
                                                    <div className="bg-primary rounded-full p-1">
                                                        <Check className="h-3 w-3 text-white" />
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-[13px] leading-relaxed text-gray-500 mt-1">
                                                Start with a clean slate. Define your own sheets, column headers, and data requirements.
                                            </p>
                                        </div>
                                        <RadioGroupItem value="custom" id="custom" className="sr-only" />
                                    </div>
                                </RadioGroup>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="sheetName" className="text-sm font-semibold text-gray-700">Primary Sheet Name</Label>
                                    <Input
                                        id="sheetName"
                                        placeholder="e.g. Active Inventory"
                                        className="h-12 border-gray-200"
                                        value={formData.sheetName}
                                        onChange={e => setFormData({ ...formData, sheetName: e.target.value })}
                                        onKeyDown={handleKeyDown}
                                        required
                                    />
                                </div>
                                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                                    <div className="flex gap-3">
                                        <div className="bg-amber-500 text-white rounded-lg p-2 h-fit">
                                            <Plus className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <Label htmlFor="numSheets" className="text-sm font-bold text-amber-900 block mb-1">Scale Your Workspace</Label>
                                            <p className="text-xs text-amber-700 mb-2">How many additional sheets do you need to start with?</p>
                                            <Input
                                                id="numSheets"
                                                type="number"
                                                min="1"
                                                max="10"
                                                className="w-24 h-9 border-amber-200 focus:border-amber-500 ring-amber-500/20 bg-white"
                                                value={formData.numSheets}
                                                onChange={e => setFormData({ ...formData, numSheets: e.target.value })}
                                                onKeyDown={handleKeyDown}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label htmlFor="columnNames" className="text-sm font-semibold text-gray-700">Column Definitions</Label>
                                    <textarea
                                        id="columnNames"
                                        placeholder="Item Name, SKU, Stock Level, Last Updated, Warehouse Location"
                                        className="min-h-[120px] w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all"
                                        value={formData.columnNames}
                                        onChange={e => setFormData({ ...formData, columnNames: e.target.value })}
                                        onKeyDown={handleKeyDown}
                                        required
                                    />
                                    <div className="flex items-center gap-2 px-1">
                                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                        <p className="text-[11px] text-gray-400 italic">Separate names with commas to create multiple columns instantly.</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="p-6 border-t bg-gray-50 flex items-center justify-between">
                        <div>
                            {step > 1 && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={handleBack}
                                    className="hover:bg-white text-gray-500"
                                >
                                    Back
                                </Button>
                            )}
                        </div>
                        <div className="flex gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setOpen(false)
                                    resetForm()
                                }}
                                className="border-gray-200 text-gray-600 hover:bg-gray-100"
                            >
                                Cancel
                            </Button>
                            {step < (formData.configType === "custom" ? 4 : 2) ? (
                                <Button
                                    type="button"
                                    onClick={handleNext}
                                    className="px-8 shadow-md"
                                    disabled={
                                        (step === 1 && !formData.name) ||
                                        (step === 2 && !formData.configType) ||
                                        isPending
                                    }
                                >
                                    Continue
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    onClick={performSubmission}
                                    className="px-8 shadow-primary/20 shadow-lg"
                                    disabled={!formData.configType || isPending}
                                >
                                    {isPending ? "Building..." : "Build Project"}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
