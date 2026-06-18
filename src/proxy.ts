import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Optional: add custom logic here
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl
        // Allow public access to landing page and auth routes
        if (pathname === "/" || pathname.startsWith("/auth") || pathname.startsWith("/api/auth")) {
          return true
        }
        // Require token for everything else
        return !!token
      },
    },
    pages: {
      signIn: "/auth/login",
    }
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - uploads (uploaded files like background image)
     */
    "/((?!_next/static|_next/image|favicon.ico|uploads).*)",
  ],
}
