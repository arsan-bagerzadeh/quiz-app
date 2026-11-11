"use server";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

const LANGS = ["fa-IR", "en-US"];

export async function loginAction(prevState, formData) {
    const email = formData.get("email");
    const password = formData.get("password");
    const lang = formData.get("lang");
    const callbackUrl = formData.get("callbackUrl");

    // lang از فرم میاد و کاربر می‌تونه دستکاریش کنه، پس فقط مقدار مجاز رو قبول می‌کنیم
    const safeLang = LANGS.includes(lang) ? lang : "fa-IR";

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: getSafeRedirect(callbackUrl, safeLang),
        });
    } catch (error) {
        if (error instanceof AuthError) {
            return { error: "invalid" };
        }
        throw error; // خیلی مهم: توضیحش پایین‌تر
    }
}

export async function logoutAction(formData) {
    const lang = formData.get("lang");
    const safeLang = LANGS.includes(lang) ? lang : "fa-IR";

    await signOut({ redirectTo: `/${safeLang}/login` });
}

function getSafeRedirect(callbackUrl, lang) {
    if (typeof callbackUrl === "string" && callbackUrl.startsWith(`/${lang}/`)) {
        return callbackUrl;
    }
    return `/${lang}/quiz`;
}

export async function githubLoginAction(formData) {
    const lang = formData.get("lang");
    const callbackUrl = formData.get("callbackUrl");
    const safeLang = LANGS.includes(lang) ? lang : "fa-IR";

    await signIn("github", {
        redirectTo: getSafeRedirect(callbackUrl, safeLang),
    });
}