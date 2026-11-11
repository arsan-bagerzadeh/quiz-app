import "./globals.css";
import "react-loading-skeleton/dist/skeleton.css";

import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import ThemeToggle from "./components/ThemeToggle";
import LanguageSwitcher from "./components/LanguageSwitcher";
import UserMenu from "./components/UserMenu";
import UpdatePrompt from "./components/UpdatePrompt";
import InstallButton from "./components/InstallButton";
import { SerwistProvider } from "@serwist/next/react";


const vazir = localFont({
    src: "./Vazir.woff2",
    display: "swap",
});

export async function generateMetadata({ params }) {
    const { lang } = await params;

    return {
        title: "Quiz App",
        description: "یک کوییز اطلاعات عمومی، نمونه‌کار فرانت‌اند",
        manifest: `/${lang}/manifest.webmanifest`,
        icons: {
            icon: [
                { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
                { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
            ],
            apple: "/icons/apple-touch-icon.png",
        },
        appleWebApp: {
            capable: true,
            title: "Quiz App",
            statusBarStyle: "default",
        },
    };
}

export const viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#F6F4EE" },
        { media: "(prefers-color-scheme: dark)", color: "#1B2A24" },
    ],
};

export default async function RootLayout({ children, params }) {
    const { lang } = await params
    return (
        <html lang={lang} dir={lang.startsWith("fa") ? "rtl" : "ltr"} className={vazir.className} suppressHydrationWarning>
            <body className="bg-[var(--color-paper)] dark:bg-[var(--color-slate)] text-[var(--color-ink)] dark:text-[var(--color-chalk)] transition-colors">
                <SerwistProvider swUrl="/sw.js" disable={process.env.NODE_ENV === "development"}>
                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                        <header className="max-w-[740px] mx-auto px-4 pt-4 flex justify-end items-center gap-2">
                            <InstallButton lang={lang} />
                            <UserMenu lang={lang} />
                            <LanguageSwitcher lang={lang} />
                            <ThemeToggle />
                        </header>
                        {children}
                    </ThemeProvider>
                    <UpdatePrompt lang={lang} />
                </SerwistProvider>
            </body>
        </html>
    );
}
