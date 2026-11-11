export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div
                className="w-14 h-14 rounded-full animate-spin
                    border-4
                    border-t-[var(--color-amber)]
                    border-x-[var(--color-paper-line)] dark:border-x-[var(--color-slate-line)]
                    border-b-[var(--color-paper-line)] dark:border-b-[var(--color-slate-line)]"
            />
        </div>
    );
}