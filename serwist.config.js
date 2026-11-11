import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { serwist } from "@serwist/next/config";

// revision: اثر انگشت محتوای فایل. چون اسم این فایل‌ها hash نداره،
// Serwist با تغییر revision می‌فهمه نسخه‌ی کش‌شده کهنه شده
const revisionOf = (file) =>
    createHash("md5").update(readFileSync(file)).digest("hex");

export default serwist({
    swSrc: "app/sw.js",
    swDest: "public/sw.js",
    precachePrerendered: false,
    additionalPrecacheEntries: [
        { url: "/offline/fa.html", revision: revisionOf("public/offline/fa.html") },
        { url: "/offline/en.html", revision: revisionOf("public/offline/en.html") },
    ],
});