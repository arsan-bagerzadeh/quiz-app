import { auth } from "@/auth";
import { logoutAction } from "../login/actions";
import { getLangs } from "../langs";

export default async function UserMenu({ lang }) {
    const session = await auth();

    // show nothing if didnt logged in
    if (!session?.user) return null;

    const dict = (await getLangs(lang)).common;

    return (
        <div className="flex items-center gap-3 me-auto">
            {session.user.image && (
                <img src={session.user.image} alt="" width={32} height={32} className="rounded-full" />
            )}
            <span className="text-sm text-[var(--color-ink-soft)] dark:text-[var(--color-chalk-soft)]">
                {session.user.name ?? session.user.email}
            </span>
            <form action={logoutAction}>
                <input type="hidden" name="lang" value={lang} />
                <button
                    type="submit"
                    className="h-10 px-4 rounded-full border border-[var(--color-paper-line)] dark:border-[var(--color-slate-line)] text-sm hover:border-[var(--color-amber)] transition-colors"
                >
                    {dict.signOut}
                </button>
            </form>
        </div>
    );
}