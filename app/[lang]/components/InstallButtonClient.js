"use client";
import { useEffect, useState } from "react";

export default function InstallButtonClient({ dict }) {
    const [installEvent, setInstallEvent] = useState(null);

    useEffect(() => {
        const onBeforeInstall = (event) => {
            event.preventDefault();
            setInstallEvent(event);
        };

        const onInstalled = () => setInstallEvent(null);

        window.addEventListener("beforeinstallprompt", onBeforeInstall);
        window.addEventListener("appinstalled", onInstalled);

        return () => {
            window.removeEventListener("beforeinstallprompt", onBeforeInstall);
            window.removeEventListener("appinstalled", onInstalled);
        };
    }, []);

    if (!installEvent) return null;

    const install = async () => {
        installEvent.prompt();
        await installEvent.userChoice;
        setInstallEvent(null);
    };

    return (
        <button
            type="button"
            onClick={install}
            aria-label={dict.install}
            className="h-10 shrink-0 inline-flex items-center gap-2 px-3 rounded-full border border-[var(--color-paper-line)] dark:border-[var(--color-slate-line)] text-sm hover:border-[var(--color-amber)] transition-colors"
        >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 3v12" />
                <path d="m7 11 5 5 5-5" />
                <path d="M5 20h14" />
            </svg>
            <span className="hidden sm:inline">{dict.install}</span>
        </button>
    );
}