"use client";
import { useActionState } from "react";
import { loginAction, githubLoginAction } from "./actions";

const inputClass =
    "w-full px-4 py-3 rounded-xl border border-[var(--color-paper-line)] dark:border-[var(--color-slate-line)] bg-transparent focus:outline-none focus:border-[var(--color-amber)]";

export default function LoginForm({ dict, lang, callbackUrl, hasError }) {
    const [state, formAction, pending] = useActionState(loginAction, null);

    return (
        <div className="flex flex-col gap-6">
            {hasError && !state?.error && (
                <p role="alert" className="text-sm text-red-500 text-center">
                    {dict.oauthError}
                </p>
            )}
            <form action={formAction} className="flex flex-col gap-4 text-start">
                <input type="hidden" name="lang" value={lang} />
                <input type="hidden" name="callbackUrl" value={callbackUrl ?? ""} />

                <label className="flex flex-col gap-1.5 text-sm">
                    {dict.email}
                    <input name="email" type="email" required dir="ltr" className={inputClass} />
                </label>

                <label className="flex flex-col gap-1.5 text-sm">
                    {dict.password}
                    <input name="password" type="password" required dir="ltr" className={inputClass} />
                </label>

                {state?.error && (
                    <p role="alert" className="text-sm text-red-500">
                        {dict.invalid}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={pending}
                    className="bg-[var(--color-amber)] text-[var(--color-amber-ink)] font-semibold px-8 py-3 rounded-full hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                    {pending ? dict.submitting : dict.submit}
                </button>
            </form>

            <p className="text-center text-sm text-[var(--color-ink-soft)] dark:text-[var(--color-chalk-soft)]">
                {dict.or}
            </p>

            <form action={githubLoginAction}>
                <input type="hidden" name="lang" value={lang} />
                <input type="hidden" name="callbackUrl" value={callbackUrl ?? ""} />
                <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-5  px-8 py-3 rounded-full border border-[var(--color-paper-line)] dark:border-[var(--color-slate-line)] font-semibold hover:border-[var(--color-amber)] transition-colors"
                >
                    <svg
                        viewBox="0 0 16 16"
                        width={20}
                        height={20}
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                    </svg>
                    {dict.github}
                </button>
            </form>
        </div>
    );
}