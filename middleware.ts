import { isLegacyPublicPath } from "@/lib/legacy-routes";
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isLegacyPublicPath(pathname)) {
    return NextResponse.redirect(new URL("/", req.url), 301);
  }

  const isProtectedPage =
    pathname.startsWith("/admin/dashboard") ||
    pathname.startsWith("/admin/new") ||
    pathname.startsWith("/admin/edit");

  const isProtectedApi = pathname.startsWith("/api/admin/posts");

  if (isProtectedPage || isProtectedApi) {
    const token = req.cookies.get("admin_auth")?.value;
    const expected = process.env.ADMIN_PASSWORD;

    if (!expected || token !== expected) {
      if (isProtectedApi) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path+",
    "/api/admin/posts/:path*",
    "/blog/:path*",
    "/blog",
    "/compress",
    "/jpg-to-png",
    "/png-to-webp",
    "/gif-compress",
    "/resize",
    "/passport-photo",
    "/pdf-convert",
    "/heic-to-jpg",
    "/pdf-compress",
    "/photo-mosaic",
    "/background-remove",
    "/gif-maker",
    "/preset",
  ],
};
