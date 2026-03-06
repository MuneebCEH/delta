"use client"

import * as React from "react"
import { useEffect, useState } from "react"

interface Status {
    service: string;
    online: boolean;
    timestamp: string;
}

interface AutomationStatusResponse {
    cgs: Status;
    noridian: Status;
}

export function AutomationStatus() {
    const [status, setStatus] = useState<AutomationStatusResponse | null>(null);

    const fetchStatus = async () => {
        try {
            const res = await fetch('/api/automation/status');
            const data = await res.json();
            setStatus(data);
        } catch (error) {
            console.error('Failed to fetch automation status:', error);
        }
    };

    useEffect(() => {
        fetchStatus();
        // Refresh every 30 seconds
        const interval = setInterval(fetchStatus, 30000);
        return () => clearInterval(interval);
    }, []);

    if (!status) {
        return (
            <>
                <span className="flex items-center text-slate-600 font-medium">
                    CGS: <span className="text-slate-400 ml-1 font-bold animate-pulse">Checking...</span>
                </span>
                <span className="flex items-center text-slate-600 font-medium">
                    Noridian: <span className="text-slate-400 ml-1 font-bold animate-pulse">Checking...</span>
                </span>
            </>
        );
    }

    return (
        <>
            <span className="flex items-center text-slate-600 font-medium whitespace-nowrap">
                CGS: <span className={status.cgs.online ? "text-green-600 ml-1 font-bold" : "text-red-500 ml-1 font-bold"}>
                    {status.cgs.online ? "Online" : "Offline"}
                </span>
            </span>
            <span className="flex items-center text-slate-600 font-medium whitespace-nowrap">
                Noridian: <span className={status.noridian.online ? "text-green-600 ml-1 font-bold" : "text-red-500 ml-1 font-bold"}>
                    {status.noridian.online ? "Online" : "Offline"}
                </span>
            </span>
        </>
    );
}
