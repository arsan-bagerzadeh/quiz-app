"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import en from "@/langs/en.json";
import fa from "@/langs/fa.json";

export default function NotFound() {
    const params = useParams();
    const lang = params?.lang ?? "fa-IR";
    const dict = (lang.startsWith("en") ? en : fa).notFound;

    return (
        <main className="min-h-screen flex items-center justify-center">
            <div className="max-w-md px-4 text-center">
                <h1 className="text-4xl font-bold mb-4">404</h1>
                <p className="text-[var(--color-ink-soft)] dark:text-[var(--color-chalk-soft)] mb-8">
                    {dict.message}
                </p>
                <Link
                    href={`/${lang}`}
                    className="inline-block bg-[var(--color-amber)] text-[var(--color-amber-ink)] font-semibold px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity"
                >
                    {dict.backHome}
                </Link>
            </div>
        </main>
    );
}