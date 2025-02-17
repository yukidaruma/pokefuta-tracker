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
    req.nextUrl.pathname.includes("chrome")
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
  lng ??= fallbackLng;

  // Redirect if lng in path is not supported
  if (
    !locales.some((loc: string) =>
      req.nextUrl.pathname.startsWith(`/${loc}`)
    ) &&
    !req.nextUrl.pathname.startsWith("/_next")
  ) {
    return NextResponse.redirect(
      new URL(`/${lng}${req.nextUrl.pathname}`, req.url)
    );
  }

  const response = NextResponse.next();
  response.cookies.set(cookieName, lng);

  return response;
}
