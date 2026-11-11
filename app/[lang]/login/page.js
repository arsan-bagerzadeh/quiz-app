import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getLangs } from "../langs";
import LoginForm from "./LoginForm";

export default async function LoginPage({ params, searchParams }) {
    const { lang } = await params;
    const { callbackUrl,error } = await searchParams;
    

    const session = await auth();
    if (session) redirect(`/${lang}/quiz`);

    const dict = (await getLangs(lang)).login;

    return (
        <main className="min-h-[calc(100vh-4rem)] flex items-center">
            <div className="max-w-sm w-full mx-auto px-4 py-16">
                <h1 className="text-2xl font-bold mb-8 text-center">{dict.title}</h1>
                <LoginForm dict={dict} lang={lang} callbackUrl={callbackUrl} hasError={!!error}  />
            </div>
        </main>
    );
}