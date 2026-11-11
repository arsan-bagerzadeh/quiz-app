import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getLangs } from "../langs";
import { quiz } from "../data";
import QuizClient from "./QuizClient";

export default async function QuizPage({ params }) {
    const { lang } = await params;

    const session = await auth();
    if (!session?.user) redirect(`/${lang}/login`);

    const dict = await getLangs(lang);
    const questions = lang.startsWith("fa") ? quiz.Faquestions : quiz.Enquestions;

    return <QuizClient dict={dict.quiz} questions={questions} />;
}