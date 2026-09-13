import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  const firstSegment = request.nextUrl.pathname.split("/").filter(Boolean)[0] ?? "";
  const locale = ["pl", "en", "es"].includes(firstSegment) ? firstSegment : "pl";
  requestHeaders.set("x-ori-locale", locale);
  const continueWithLocale = () => NextResponse.next({ request: { headers: requestHeaders } });

  const pathname = request.nextUrl.pathname;
  const isProtectedPage = pathname.startsWith("/dashboard");
  const isProtectedApi = pathname === "/api/admin" || pathname.startsWith("/api/admin/") || pathname === "/api/debug-db";
  if (!isProtectedPage && !isProtectedApi) return continueWithLocale();

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (token?.role === "admin") return continueWithLocale();

  if (isProtectedApi) {
    return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("callbackUrl", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/((?!api/|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
    "/dashboard/:path*",
    "/api/admin/:path*",
    "/api/debug-db",
  ],
};
