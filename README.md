# Quiz App

A bilingual (Persian / English) quiz application built with **Next.js 16** and the App Router. It is a portfolio project that demonstrates three things end to end: **internationalized routing with RTL support**, **authentication with Auth.js**, and a **Progressive Web App** that is installable, updatable and safe to use behind a login.

## Features

- **Multilanguage routing** - every page lives under `/[lang]` (`fa-IR`, `en-US`). A proxy detects the language from a saved cookie or the `Accept-Language` header, and the UI switches between RTL and LTR automatically.
- **Authentication (Auth.js v5)** - sign in with email and password or with GitHub, sign out, and a custom login page that is translated and keeps the language.
- **Protected quiz** - unauthenticated users cannot open the quiz. Access is checked in two independent layers (see below), and users return to the page they asked for after signing in.
- **Progressive Web App** - web app manifest per language, installable with a custom install button, an offline fallback page in both languages, and an in-app "new version available" prompt.
- **Dark and light theme** with a toggle that follows the system preference.
- **Accessible, responsive UI** styled with Tailwind CSS 4.

## Tech stack

| Area | Tools |
|---|---|
| Framework | Next.js 16 (App Router, Server Actions), React 19 |
| Auth | Auth.js (`next-auth` v5 beta), JWT sessions |
| PWA | Serwist 9 (configurator mode) |
| Styling | Tailwind CSS 4, `next-themes` |
| i18n | `@formatjs/intl-localematcher`, `negotiator`, JSON dictionaries |

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values (see below)
npm run dev
```

Open `http://localhost:3000`. You will be redirected to your language.

### Environment variables

| Variable | Description |
|---|---|
| `AUTH_SECRET` | Random secret used to sign the session cookie. Generate one with `openssl rand -base64 33`. |
| `AUTH_GITHUB_ID` | Client ID of your GitHub OAuth App. |
| `AUTH_GITHUB_SECRET` | Client secret of your GitHub OAuth App. |
| `AUTH_TRUST_HOST` | Set to `true` when running the production build locally (`npm run start`). |

To enable GitHub sign-in, create an OAuth App in your GitHub account (Settings, Developer settings, OAuth Apps) with:

- Homepage URL: `http://localhost:3000`
- Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

### Demo account

Email and password sign-in uses a **hard-coded demo user** so the project runs without a database:

```
email:    test@test.com
password: 123456
```

This is for demonstration only. A real project would verify credentials against a database with hashed passwords.

### Testing the PWA

The service worker is **disabled in development**. To test the PWA features, use a production build:

```bash
npm run build     # runs "next build" and then "serwist build" to generate public/sw.js
npm run start
```

Then open the site in Chrome or Edge and check DevTools, Application tab (Manifest, Service Workers, Cache Storage). Use the Network tab's "Offline" option to see the offline page.

## How it works

### Authentication and route protection

Access to `/[lang]/quiz` is protected in two layers:

1. **`proxy.js`** wraps the language logic with Auth.js. It redirects signed-out users to `/[lang]/login?callbackUrl=...` early and redirects signed-in users away from the login page.
2. **`app/[lang]/quiz/page.js`** calls `auth()` on the server before any quiz data is read. This is the layer that actually guards the data, so the page stays protected even if the proxy is bypassed or misconfigured.

The `callbackUrl` and `lang` values coming from the form are validated against an allow-list before redirecting, which prevents open-redirect attacks.

### PWA and caching strategy

Because the quiz is behind a login, the service worker uses an **allow-list**: nothing is cached unless it is explicitly allowed.

| Request | Strategy | Reason |
|---|---|---|
| Page navigations (HTML) | Network only | HTML depends on the signed-in user |
| `/api/*` and RSC requests | Network only | Session and server data |
| `/_next/static/*` | Cache first | File names contain a content hash |
| Offline pages, files in `public/` | Precache | Static and public |

When the network is unavailable, navigations fall back to a standalone offline page (`public/offline/fa.html` or `en.html`). These pages are plain HTML with no layout or session data, so no user information can end up in the cache.

When a new version of the service worker is waiting, the app shows a prompt and activates it only after the user confirms, to avoid mixing old pages with new cached files.

## Project structure

```
app/
  [lang]/
    components/        header, theme toggle, language switcher, user menu, install and update prompts
    login/             login page, form and server actions
    quiz/              protected quiz page and client component
    manifest.webmanifest/route.js   per-language web app manifest
  api/auth/[...nextauth]/           Auth.js route handler
  sw.js                service worker source (compiled to public/sw.js)
langs/                 en.json and fa.json dictionaries
public/
  icons/               PWA icons (any, maskable, apple touch)
  offline/             offline fallback pages
auth.js                Auth.js configuration
proxy.js               language detection and auth protection
serwist.config.js      service worker build configuration
```

## Limitations

- The quiz questions and correct answers are shipped to the client for this demo. A production quiz should check answers on the server.
- Email and password sign-in uses a single hard-coded demo user.
- Auth.js v5 is still published as a beta.
- The quiz needs a network connection to open; only the offline fallback page is available offline.

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server (service worker disabled) |
| `npm run build` | Build the app and generate the service worker |
| `npm run start` | Start the production server |