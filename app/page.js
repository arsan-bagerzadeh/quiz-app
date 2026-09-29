import Link from "next/link";

export default function Home() {
    return (
        <main>
            <div className="container">
                <h1>اپلیکیشن Quiz</h1>
                <Link href="/quiz" prefetch={false}>
                    <button>شروع آزمون</button>
                </Link>
                <Link href="/about">
                    <button>درباره‌ی من</button>
                </Link>
            </div>
        </main>
    );
}
