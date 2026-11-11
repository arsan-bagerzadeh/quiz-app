import {
    CacheFirst,
    ExpirationPlugin,
    NetworkOnly,
    Serwist,
    StaleWhileRevalidate,
} from "serwist";

const DAY = 24 * 60 * 60;

const serwist = new Serwist({
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: false,
    clientsClaim: true,
    runtimeCaching: [
        // ۱) هرگز کش نشه: خود صفحه‌ها (HTML وابسته به کاربره)
        {
            matcher: ({ request }) => request.mode === "navigate",
            handler: new NetworkOnly(),
        },

        // ۲) هرگز کش نشه: API (از جمله /api/auth/*) و درخواست‌های RSC
        {
            matcher: ({ url, request }) =>
                url.pathname.startsWith("/api/") ||
                url.searchParams.has("_rsc") ||
                request.headers.has("RSC"),
            handler: new NetworkOnly(),
        },

        // ۳) فایل‌های build با اسم hash‌دار: امنه که کش بمونن
        {
            matcher: ({ url, sameOrigin }) =>
                sameOrigin && url.pathname.startsWith("/_next/static/"),
            handler: new CacheFirst({
                cacheName: "next-static",
                plugins: [
                    new ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 30 * DAY }),
                ],
            }),
        },
    ],
    fallbacks: {
        entries: [
            {
                url: "/offline/en.html",
                matcher: ({ request }) =>
                    request.destination === "document" &&
                    new URL(request.url).pathname.startsWith("/en"),
            },
            {
                url: "/offline/fa.html",
                matcher: ({ request }) => request.destination === "document",
            },
        ],
    },
});

serwist.addEventListeners();