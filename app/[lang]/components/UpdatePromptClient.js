"use client";
import { useEffect, useRef, useState } from "react";

export default function UpdatePromptClient({ dict }) {
    const [waitingWorker, setWaitingWorker] = useState(null);
    const userAccepted = useRef(false);

    useEffect(() => {
        if (!("serviceWorker" in navigator)) return;

        let registration;
        let cancelled = false;

        // نسخه‌ی جدید که نصب شد و هنوز نسخه‌ی قدیمی کنترل صفحه رو داره
        const watch = (worker) => {
            worker.addEventListener("statechange", () => {
                if (worker.state === "installed" && navigator.serviceWorker.controller) {
                    setWaitingWorker(worker);
                }
            });
        };

        const onUpdateFound = () => {
            if (registration?.installing) watch(registration.installing);
        };

        const checkForUpdate = () => {
            if (document.visibilityState === "visible") {
                registration?.update()?.catch(() => {});
            }
        };

        const onControllerChange = () => {
            if (userAccepted.current) window.location.reload();
        };

        navigator.serviceWorker.ready.then((reg) => {
            if (cancelled) return;
            registration = reg;
            if (reg.waiting) setWaitingWorker(reg.waiting);
            reg.addEventListener("updatefound", onUpdateFound);
        });

        navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);
        document.addEventListener("visibilitychange", checkForUpdate);

        return () => {
            cancelled = true;
            registration?.removeEventListener("updatefound", onUpdateFound);
            navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
            document.removeEventListener("visibilitychange", checkForUpdate);
        };
    }, []);

    if (!waitingWorker) return null;

    const update = () => {
        userAccepted.current = true;
        waitingWorker.postMessage({ type: "SKIP_WAITING" });
    };

    return (
        <div
            role="status"
            className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:end-4 z-50 flex items-center justify-between gap-4 px-4 py-3 rounded-2xl border border-[var(--color-paper-line)] dark:border-[var(--color-slate-line)] bg-[var(--color-paper)] dark:bg-[var(--color-slate)] shadow-lg"
        >
            <span className="text-sm">{dict.updateAvailable}</span>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => setWaitingWorker(null)}
                    className="text-sm px-3 py-1.5 rounded-full hover:opacity-70"
                >
                    {dict.updateLater}
                </button>
                <button
                    type="button"
                    onClick={update}
                    className="text-sm font-semibold px-4 py-1.5 rounded-full bg-[var(--color-amber)] text-[var(--color-amber-ink)] hover:opacity-90"
                >
                    {dict.updateNow}
                </button>
            </div>
        </div>
    );
}