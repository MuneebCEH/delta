"use client"

import * as React from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
    Lock,
    Mail,
    Eye,
    EyeOff,
    Loader2,
    ShieldCheck,
    AlertCircle,
    ArrowRight,
    Fingerprint,
    Activity,
    Stethoscope,
    ShieldAlert,
    Dna
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function LoginPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = React.useState(false)
    const [showPassword, setShowPassword] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const [email, setEmail] = React.useState("")
    const [password, setPassword] = React.useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const result = await signIn("credentials", {
                email: email,
                password: password,
                redirect: false,
            })

            if (result?.error) {
                setError("INTELLIGENCE ERROR: ACCESS DENIED. VERIFY CLEARANCE KEYS.")
            } else {
                router.push("/dashboard")
                router.refresh()
            }
        } catch (err) {
            setError("SYSTEM CRITICAL: AUTHENTICATION ENCRYPTION FAILED.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] p-6 relative overflow-auto font-sans selection:bg-blue-500/30">
            {/* Cinematic Background Elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[160px] animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[160px] animate-pulse [animation-delay:2s]" />

            {/* Grid Pattern Mesh */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.15]" />

            <div className="w-full max-w-[1280px] min-h-[720px] grid lg:grid-cols-2 bg-[#0a0f1e]/40 backdrop-blur-3xl rounded-[3rem] border border-white/5 shadow-[0_32px_120px_rgba(0,0,0,0.5)] overflow-hidden relative z-10 animate-in fade-in zoom-in duration-1000">

                {/* Brand Showcase Side */}
                <div className="hidden lg:flex flex-col justify-between p-20 relative overflow-hidden bg-gradient-to-br from-[#0f172a] to-[#020617]">
                    {/* Decorative DNA Strand/Abstract */}
                    <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 flex flex-col justify-around items-end pointer-events-none">
                        <Dna className="w-32 h-32 text-blue-500 rotate-12" />
                        <Activity className="w-48 h-48 text-indigo-500 -rotate-12" />
                        <Stethoscope className="w-32 h-32 text-blue-400 rotate-45" />
                    </div>

                    <div className="relative z-10 space-y-12">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)] group cursor-default">
                                <ShieldCheck className="text-white h-8 w-8 group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-black text-white tracking-tighter leading-none">DELTA MEDICAL</span>
                                <span className="text-xs font-black text-blue-500 tracking-[0.4em] uppercase opacity-70">Group Platform</span>
                            </div>
                        </div>

                        <div className="space-y-8 pt-12">
                            <h2 className="text-7xl font-black text-white tracking-tighter leading-[0.9]">
                                Secure <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Intelligence</span> <br />
                                Hub.
                            </h2>
                            <p className="text-slate-400 font-bold text-xl max-w-md leading-relaxed opacity-80 decoration-blue-500/50 underline-offset-8">
                                Proprietary clinical logistics & intelligence gateway for healthcare professionals.
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-12">
                            <div className="space-y-1">
                                <p className="text-blue-500 font-black uppercase tracking-[0.2em] text-[10px]">Security Engine</p>
                                <p className="text-white/80 font-black text-sm uppercase">Quantum AES-256</p>
                            </div>
                            <div className="space-y-1 border-l border-white/10 pl-12">
                                <p className="text-indigo-400 font-black uppercase tracking-[0.2em] text-[10px]">Data Node</p>
                                <p className="text-white/80 font-black text-sm uppercase">Secure US-PRIMARY</p>
                            </div>
                        </div>
                    </div>

                    {/* Glowing Accents */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)] pointer-events-none" />
                </div>

                {/* Authentication Form Side */}
                <div className="p-12 md:p-24 flex flex-col justify-center bg-transparent relative overflow-hidden">
                    {/* Mobile Logo Visibility */}
                    <div className="lg:hidden absolute top-12 left-12 flex items-center gap-3">
                        <ShieldCheck className="text-blue-500 h-8 w-8" />
                        <span className="text-xl font-black text-white tracking-tighter">DELTA MEDICAL GROUP</span>
                    </div>

                    <div className="max-w-md w-full mx-auto space-y-12 relative z-10">
                        <div className="space-y-3">
                            <h1 className="text-5xl font-black text-white tracking-tight">Access Node</h1>
                            <div className="flex items-center gap-2">
                                <div className="h-0.5 w-6 bg-blue-500" />
                                <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">Delta Medical Authorized Entry</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {error && (
                                <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-4 text-red-500 animate-in shake duration-500">
                                    <ShieldAlert className="h-6 w-6 shrink-0" />
                                    <p className="text-xs font-black uppercase tracking-widest leading-tight">{error}</p>
                                </div>
                            )}

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 ml-1">Secure Identity</label>
                                    <div className="relative group/field">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/field:text-blue-500 transition-colors duration-500">
                                            <Mail className="h-5 w-5" />
                                        </div>
                                        <Input
                                            type="email"
                                            placeholder="operative@deltamedical.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value.toLowerCase())}
                                            className="h-16 pl-16 rounded-2xl border-white/5 bg-white/[0.03] px-6 focus-visible:ring-blue-500 focus-visible:bg-white/[0.05] focus-visible:border-blue-500/50 font-black tracking-widest transition-all duration-500 text-white placeholder:text-slate-700"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between ml-1">
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Encrypted Passkey</label>
                                    </div>
                                    <div className="relative group/field">
                                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/field:text-blue-500 transition-colors duration-500">
                                            <Lock className="h-5 w-5" />
                                        </div>
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="h-16 pl-16 pr-16 rounded-2xl border-white/5 bg-white/[0.03] px-6 focus-visible:ring-blue-500 focus-visible:bg-white/[0.05] focus-visible:border-blue-500/50 font-black tracking-widest transition-all duration-500 text-white placeholder:text-slate-700"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-600 hover:text-blue-500 transition-colors duration-500"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between py-2">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center">
                                        <input type="checkbox" className="peer sr-only" />
                                        <div className="h-5 w-5 rounded-lg border-2 border-slate-800 bg-[#0a0f1e] transition-all peer-checked:bg-blue-600 peer-checked:border-blue-600" />
                                        <ShieldCheck className="absolute h-3.5 w-3.5 text-white scale-0 peer-checked:scale-100 transition-transform duration-300 left-0.5" />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-slate-400 transition-colors">Remember Session</span>
                                </label>
                                <button type="button" className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 hover:text-indigo-300 transition-colors">Recalibrate Access</button>
                            </div>

                            <Button
                                className="w-full h-20 rounded-[1.8rem] bg-blue-600 hover:bg-blue-500 text-white font-black text-lg shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:shadow-[0_25px_60px_rgba(37,99,235,0.4)] transition-all duration-500 active:scale-[0.97] disabled:opacity-50 overflow-hidden relative group"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-3">
                                        <Loader2 className="h-6 w-6 animate-spin" />
                                        <span className="uppercase tracking-[0.2em]">Authenticating...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center w-full relative z-10 gap-3 group-hover:gap-5 transition-all duration-500">
                                        <span className="uppercase tracking-[0.3em] pl-1">ENTER GATEWAY</span>
                                        <ArrowRight className="h-6 w-6" />
                                    </div>
                                )}
                                {/* Button Shine Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000" />
                            </Button>

                            <div className="pt-12 flex flex-col items-center gap-8">
                                <div className="flex items-center gap-4">
                                    <div className="h-[1px] w-8 bg-white/10" />
                                    <Fingerprint className="text-slate-700 h-6 w-6" />
                                    <div className="h-[1px] w-8 bg-white/10" />
                                </div>
                                <div className="text-center space-y-4">
                                    <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.4em] leading-relaxed max-w-[280px]">
                                        ACCESS TO THE DELTA MEDICAL GROUP NETWORK IS RESTRICTED TO AUTHORIZED PERSONNEL UNDER 21 C.F.R. PART 11.
                                    </p>
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[8px] font-black text-emerald-500/50 uppercase tracking-[0.3em]">Neural Encryption Active</span>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Floating Bokeh Elements */}
            <div className="absolute top-[15%] right-[10%] w-32 h-32 bg-blue-500/20 rounded-full blur-[80px] animate-float" />
            <div className="absolute bottom-[20%] left-[5%] w-48 h-48 bg-indigo-500/20 rounded-full blur-[100px] animate-float-delayed" />

            <style jsx global>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-30px) scale(1.1); }
                }
                @keyframes float-delayed {
                    0%, 100% { transform: translateY(0) scale(1.1); }
                    50% { transform: translateY(40px) scale(1); }
                }
                .animate-float { animation: float 8s ease-in-out infinite; }
                .animate-float-delayed { animation: float-delayed 10s ease-in-out infinite; }
            `}</style>
        </div>
    )
}
