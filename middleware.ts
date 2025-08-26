import { NextRequest, NextResponse } from "next/server";
import acceptLanguage from "accept-language";
import { locales, cookieName } from "@/i18n/constants";

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

  // Path -> Cookie -> Accept-Language -> Fallback
  let lng: string | null = null;
  for (const locale of locales) {
    if (req.nextUrl.pathname.startsWith(`/${locale}`)) {
      lng = locale;
    }
  }

  if (
    !lng &&
    req.cookies.has(cookieName) &&
    req.cookies.get(cookieName)!.value !== "undefined"
  ) {
    lng = acceptLanguage.get(req.cookies.get(cookieName)!.value);
  }

  lng ??= acceptLanguage.get(req.headers.get("Accept-Language"));
  lng ??= locales[0];

  // Redirect if lng in path is not supported
  if (
    !locales.some((loc: string) =>
      req.nextUrl.pathname.startsWith(`/${loc}`)
    ) &&
    !req.nextUrl.pathname.startsWith("/_next")
  ) {
    const path = `/${lng}${req.nextUrl.pathname}`;
    const normalizedPath = path.replace(/\/+$/g, "");
    return NextResponse.redirect(new URL(normalizedPath, req.url), 308);
  }

  const response = NextResponse.next();
  response.cookies.set(cookieName, lng);

  return response;
}
