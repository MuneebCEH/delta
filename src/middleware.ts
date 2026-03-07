import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
        pages: {
            signIn: "/login",
        }
    }
)

export const config = {
    matcher: [
        "/chat/:path*",
        "/dashboard/:path*",
        "/team/:path*",
        "/settings/:path*",
        "/projects/:path*",
        "/customers/:path*",
        "/sales/:path*",
        "/reports/:path*",
        "/admin/:path*",
        "/support/:path*",
        "/tasks/:path*",
        "/leads/:path*",
        "/contracts/:path*",
        "/proposals/:path*",
    ]
}
