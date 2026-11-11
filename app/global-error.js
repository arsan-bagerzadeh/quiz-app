"use client";
import "./[lang]/globals.css";

export default function GlobalError({ error, retry }) {
  return (
    <html lang="fa-IR" dir="rtl">
      <body>
        <main className="min-h-screen flex items-center justify-center">
          <div className="max-w-md px-4 text-center">
            <h1 className="text-2xl font-bold mb-1">یه خطای کلی رخ داد</h1>
            <p className="text-sm mb-3">Something went wrong</p>
            <p className="text-[var(--color-ink-soft)] mb-8">{error.message}</p>
            <button
              onClick={() => retry()}
              className="bg-[var(--color-amber)] text-[var(--color-amber-ink)] font-semibold px-6 py-2.5 rounded-full hover:opacity-90 transition-opacity"
            >
              تلاش مجدد / Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}