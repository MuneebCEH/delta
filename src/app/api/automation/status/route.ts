import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

export async function GET() {
    try {
        const cgsStatusFile = path.join(process.cwd(), 'cgs_status.json');
        let cgsStatus = { service: 'CGS', online: false, timestamp: null };

        if (fs.existsSync(cgsStatusFile)) {
            const data = JSON.parse(fs.readFileSync(cgsStatusFile, 'utf8'));
            const age = Date.now() - new Date(data.timestamp).getTime();

            // If status is less than 2 minutes old, use it
            if (age < 120000) {
                cgsStatus = data;
            } else {
                // Background update if old, but return old data for speed if available
                triggerUpdate();
                cgsStatus = data;
            }
        } else {
            // No status file, trigger update and wait a bit or return offline
            await runUpdate();
            if (fs.existsSync(cgsStatusFile)) {
                cgsStatus = JSON.parse(fs.readFileSync(cgsStatusFile, 'utf8'));
            }
        }

        // For now Noridian is hardcoded as offline or we can just mock it
        const noridianStatus = { service: 'Noridian', online: false, timestamp: new Date().toISOString() };

        return NextResponse.json({
            cgs: cgsStatus,
            noridian: noridianStatus
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

function triggerUpdate() {
    const scriptPath = path.join(process.cwd(), 'scripts', 'check_cgs_status.js');
    exec(`node ${scriptPath}`, (error) => {
        if (error) console.error('CGS Status Update Failed:', error);
    });
}

async function runUpdate() {
    const scriptPath = path.join(process.cwd(), 'scripts', 'check_cgs_status.js');
    return new Promise((resolve) => {
        exec(`node ${scriptPath}`, (error) => {
            resolve(true);
        });
    });
}
