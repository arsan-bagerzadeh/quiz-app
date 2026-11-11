const LOCALES = ["en-US", "en", "fa-IR", "fa"];

const TEXT = {
    fa: {
        name: "اپلیکیشن کوییز",
        short_name: "کوییز",
        description: "یک کوییز اطلاعات عمومی",
        dir: "rtl",
    },
    en: {
        name: "Quiz App",
        short_name: "Quiz App",
        description: "A general knowledge quiz",
        dir: "ltr",
    },
};

export async function GET(request, { params }) {
    const { lang } = await params;

    // مثل بقیه‌ی جاها: ورودی آدرس رو با لیست مجاز مقایسه می‌کنیم
    if (!LOCALES.includes(lang)) {
        return new Response("Not found", { status: 404 });
    }

    const t = lang.startsWith("fa") ? TEXT.fa : TEXT.en;

    const manifest = {
        id: "/",
        name: t.name,
        short_name: t.short_name,
        description: t.description,
        lang,
        dir: t.dir,
        start_url: `/${lang}`,
        scope: "/",
        display: "standalone",
        background_color: "#F6F4EE",
        theme_color: "#1B2A24",
        icons: [
            { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
            { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
            { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
    };

    return Response.json(manifest, {
        headers: { "Content-Type": "application/manifest+json" },
    });
}