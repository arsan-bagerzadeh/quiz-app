"use client";
import { usePathname, useRouter } from "next/navigation";

const LANG_NAMES = { "fa-IR": "فارسی", "en-US": "English" };

export default function LanguageSwitcher({ lang }) {
    const router = useRouter();
    const pathname = usePathname();

    // زبان مقابل: اگه الان فارسی هستیم، انگلیسی و برعکس
    const targetLang = lang.startsWith("fa") ? "en-US" : "fa-IR";

    function switchLang() {
        // ذخیره‌ی انتخاب کاربر تو کوکی (یک سال)
        document.cookie = `NEXT_LOCALE=${targetLang}; path=/; max-age=31536000; samesite=lax`;

        // "/fa-IR/quiz" رو می‌شکنیم، بخش زبان رو عوض می‌کنیم و دوباره می‌چسبونیم
        const segments = pathname.split("/");
        segments[1] = targetLang;
        router.push(segments.join("/"));
    }

    return (
        <button
            type="button"
            onClick={switchLang}
            className="h-10 px-4 shrink-0 rounded-full border border-[var(--color-paper-line)] dark:border-[var(--color-slate-line)] text-sm text-[var(--color-ink)] dark:text-[var(--color-chalk)] hover:border-[var(--color-amber)] transition-colors"
        >
            {LANG_NAMES[targetLang]}
        </button>
    );
}