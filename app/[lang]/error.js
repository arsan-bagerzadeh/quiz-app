"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import en from "@/langs/en.json";
import fa from "@/langs/fa.json";

export default function Error({ error, unstable_retry }) {
    const params = useParams();
    const dict = (params?.lang?.startsWith("en") ? en : fa).error;

    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <main className="min-h-screen flex items-center justify-center">
            <div className="max-w-[420px] px-4 text-center">
                <h2 className="text-xl font-bold mb-4">{dict.message}</h2>
                <button
                    onClick={() => unstable_retry()}
                    className="bg-[var(--color-amber)] text-[var(--color-amber-ink)] font-semibold px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity"
                >
                    {dict.retry}
                </button>
            </div>
        </main>
    );
}