import Link from "next/link";
import { getLangs } from "./langs";

export default async function Home({ params }) {
    const { lang } = await params;
    const dict = (await getLangs(lang)).home;

    return (
        <main className="min-h-[calc(100vh-4rem)] flex items-center">
            <div className="max-w-[740px] w-full mx-auto px-4 py-16 text-center">
                <p className="text-sm text-[var(--color-ink-soft)] dark:text-[var(--color-chalk-soft)] mb-3">
                    {dict.badge}
                </p>
                <h1 className="text-2xl  font-bold leading-tight mb-6">
                    {dict.titleStart} <span className="chalk-underline">{dict.titleHighlight}</span> {dict.titleEnd}
                </h1>
                <p className="text-[var(--color-ink-soft)] dark:text-[var(--color-chalk-soft)] mb-10 max-w-md mx-auto">
                    {dict.description}
                </p>
                <Link href={`/${lang}/quiz`} prefetch={false}>
                    <button className="bg-[var(--color-amber)] text-[var(--color-amber-ink)] font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity">
                        {dict.startBtn}
                    </button>
                </Link>
            </div>
        </main>
    );
}