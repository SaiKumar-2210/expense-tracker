import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === "/" || path === "/login" || path === "/register"

  // Get the session cookie
  const sessionId = request.cookies.get("session_id")?.value

  // If the user is not authenticated and trying to access a protected route
  if (!sessionId && !isPublicPath) {
    // Redirect to login page
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If the user is authenticated and trying to access a public path
  if (sessionId && isPublicPath) {
    // Redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Otherwise, continue with the request
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/login", "/register", "/dashboard/:path*"],
}

