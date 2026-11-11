import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
    session: { strategy: "jwt" },
    pages: {
        signIn: "/login",
        signOut: "/login",
        error: "/login",
    },
    providers: [
        GitHub,
        Credentials({
            credentials: {
                email: {},
                password: {},
            },

            authorize: async (credentials) => {
                if (credentials.email === "test@test.com" && credentials.password === "123456") {
                    return { id: "1", name: "Test User", email: "test@test.com" };
                }
                return null;
            },
        }),
    ],
});