"use server"

export async function checkNetworkStatus() {
    // These are official URLs associated with CGS and Noridian Medicare (DME Administrative Contractors)
    const targets = [
        { name: 'CGS', url: 'https://www.cgsmedicare.com' },
        { name: 'Noridian', url: 'https://med.noridianmedicare.com' }
    ]

    try {
        const results = await Promise.all(targets.map(async (t) => {
            try {
                const start = Date.now()
                // Use a short timeout to prevent hanging
                const controller = new AbortController()
                const timeoutId = setTimeout(() => controller.abort(), 8000)

                const response = await fetch(t.url, {
                    method: 'HEAD',
                    signal: controller.signal,
                    cache: 'no-store'
                })

                clearTimeout(timeoutId)
                const latency = Date.now() - start

                return {
                    name: t.name,
                    status: response.ok ? 'online' : 'degraded',
                    latency: `${latency}ms`
                }
            } catch (err) {
                return {
                    name: t.name,
                    status: 'offline',
                    latency: '---'
                }
            }
        }))
        return results
    } catch (err) {
        console.error("Network check failed:", err)
        return targets.map(t => ({ name: t.name, status: 'unknown', latency: '---' }))
    }
}
