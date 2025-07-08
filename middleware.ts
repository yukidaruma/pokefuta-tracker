import { NextRequest, NextResponse } from "next/server";
import acceptLanguage from "accept-language";
import { fallbackLng, locales, cookieName } from "@/i18n/constants";

acceptLanguage.languages(locales);

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|images|assets|favicon.ico|sw.js|manifest.webmanifest).*)",
  ],
};

export function middleware(req: NextRequest) {
  if (
    req.nextUrl.pathname.includes("icon") ||
    req.nextUrl.pathname.includes("chrome") ||
    req.nextUrl.pathname.endsWith("xml") // sitemap.xml
  ) {
    return NextResponse.next();
  }

  // Check if accessing fallbackLng path directly - redirect to root
  if (
    req.nextUrl.pathname === `/${fallbackLng}` ||
    req.nextUrl.pathname.startsWith(`/${fallbackLng}/`)
  ) {
    const pathWithoutLng =
      req.nextUrl.pathname.replace(`/${fallbackLng}`, "") || "/";
    return NextResponse.redirect(new URL(pathWithoutLng, req.url));
  }

  // Path -> Cookie -> Accept-Language -> Fallback
  let lng: string | null = null;
  const pathSegments = req.nextUrl.pathname.split("/");
  const firstSegment = pathSegments[1];

  // Check if first segment is a valid locale
  // i.e.) exclude /[item] paths
  if (firstSegment && locales.includes(firstSegment)) {
    lng = firstSegment;
    // If accessing non-fallback locale, continue without redirect
    return NextResponse.next();
  }

  if (
    !lng &&
    req.cookies.has(cookieName) &&
    req.cookies.get(cookieName)!.value !== "undefined"
  ) {
    lng = acceptLanguage.get(req.cookies.get(cookieName)!.value);
  }

  lng ??= acceptLanguage.get(req.headers.get("Accept-Language"));
  lng ??= fallbackLng;

  let response: NextResponse;
  if (req.nextUrl.pathname.startsWith("/_next")) {
    response = NextResponse.next();
  } else {
    const path = `/${lng}${req.nextUrl.pathname}`;
    const normalizedPath = path.replace(/\/+/g, "/").replace(/\/$/, "") || "/";

    // For fallbackLng, omit `/[locale]` prefix in the path
    if (lng === fallbackLng) {
      response = NextResponse.rewrite(new URL(normalizedPath, req.url));
    } else {
      response = NextResponse.redirect(new URL(normalizedPath, req.url));
    }
  }

  response.cookies.set(cookieName, lng);
  return response;
}
