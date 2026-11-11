import { NextResponse } from "next/server";

import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { auth } from "@/auth";

const locals = ['en-US', 'en', 'fa-IR', 'fa'];

function getLocale(request) {

    const savedLocale = request.cookies.get("NEXT_LOCALE")?.value;
    if (savedLocale && locals.includes(savedLocale)) return savedLocale;

    const negotiatorHeader = {};
    request.headers.forEach((value, key) => (negotiatorHeader[key] = value));

    const languages = new Negotiator({ headers: negotiatorHeader }).languages();

    const defaultLocale = "fa-IR";
    const locale = match(languages, locals, defaultLocale)

    return locale;
}

function handleLocale(request) {
    const { pathname } = request.nextUrl;

    const pathnameHasLocale = locals.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )

    if (pathnameHasLocale) return;


    const locale = getLocale(request);

    return NextResponse.redirect(new URL(`/${locale}${pathname.startsWith('/') ? '' : "/"}${pathname}${request.nextUrl.search}`, request.url))

}

export const proxy = auth((request) => {
    const { pathname, search } = request.nextUrl;

    const currentLocale = locals.find(
        (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
    );

    if (!currentLocale) return handleLocale(request);

    const isLoggedIn = !!request.auth;

    // "/fa-IR/quiz" -> "/quiz"
    const pathWithoutLocale = pathname.slice(`/${currentLocale}`.length) || "/";

    const isProtected = pathWithoutLocale === "/quiz" || pathWithoutLocale.startsWith("/quiz/");
    const isLoginPage = pathWithoutLocale === "/login";

    if (isProtected && !isLoggedIn) {
        const loginUrl = new URL(`/${currentLocale}/login`, request.url);
        loginUrl.searchParams.set("callbackUrl", pathname + search);
        return NextResponse.redirect(loginUrl);
    }

    if (isLoginPage && isLoggedIn) {
        return NextResponse.redirect(new URL(`/${currentLocale}/quiz`, request.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|icons|sw.js|offline).*)"
    ],
}