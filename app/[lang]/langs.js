const langs = {
    "en-US": () => import("../../langs/en.json").then(module => module.default),
    en: () => import("../../langs/en.json").then(module => module.default),
    fa: () => import("../../langs/fa.json").then(module => module.default),
    "fa-IR": () => import("../../langs/fa.json").then(module => module.default)
}

export const getLangs = async (locale) => langs[locale]();