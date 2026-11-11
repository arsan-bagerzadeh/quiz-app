"use client";
import { useState, use, Suspense, useMemo } from "react";
import Skeleton from "react-loading-skeleton";

export default function QuizClient({ dict, questions }) {
    const totalQuestions = questions.length;
    const [activeQuestion, setActiveQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [answersLog, setAnswersLog] = useState([]);
    const [result, setResult] = useState({
        score: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
    });

    function createDelayedAnswer(answer) {
        const delay = (1 + Math.floor(Math.random() * 3)) * 1000;
        return new Promise((resolve) => {
            setTimeout(() => resolve(answer), delay);
        });
    }

    function AnswerOption({ promise, index, getOptionClass, onSelect }) {
        const answer = use(promise);

        return (
            <li
                onClick={() => onSelect(answer, index)}
                className={`flex items-center justify-between px-4 py-4 border-b border-[var(--color-paper-line)] dark:border-[var(--color-slate-line)] last:border-b-0 cursor-pointer transition-colors ${getOptionClass(answer, index)}`}
            >
                <span>{answer}</span>
                {index === selectedAnswerIndex && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 13l4 4L19 7" />
                    </svg>
                )}
            </li>
        );
    }

    function handleAnswerSelection(answer, index) {
        setSelectedAnswer(answer);
        setSelectedAnswerIndex(index);
    }

    function getOptionClass(index) {
        if (index === selectedAnswerIndex) {
            return "bg-[var(--color-amber)] text-[var(--color-amber-ink)]";
        }
        return "hover:bg-[var(--color-paper-line)]/40 dark:hover:bg-[var(--color-slate-line)]/40";
    }

    function handleNext() {
        const currentQuestion = questions[activeQuestion];
        const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

        setAnswersLog((prev) => [
            ...prev,
            {
                question: currentQuestion.question,
                userAnswer: selectedAnswer,
                correctAnswer: currentQuestion.correctAnswer,
                isCorrect,
            },
        ]);

        setResult((prev) => ({
            score: isCorrect ? prev.score + 1 : prev.score,
            correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
            wrongAnswers: !isCorrect ? prev.wrongAnswers + 1 : prev.wrongAnswers,
        }));

        if (activeQuestion + 1 < totalQuestions) {
            setActiveQuestion((prev) => prev + 1);
            setSelectedAnswer("");
            setSelectedAnswerIndex(null);
        } else {
            setShowResult(true);
        }
    }

    const answerPromises = useMemo(
        () => questions[activeQuestion].answers.map((answer) => createDelayedAnswer(answer)),
        [activeQuestion]
    );

    if (showResult) {
        return (
            <main className="max-w-[740px] mx-auto px-4 py-10">
                <div className="text-center mb-10">
                    <p className="text-sm text-[var(--color-ink-soft)] dark:text-[var(--color-chalk-soft)] mb-2">
                        {dict.resultTitle}
                    </p>
                    <p className="text-6xl font-bold">
                        {result.score}
                        <span className="text-2xl text-[var(--color-ink-soft)] dark:text-[var(--color-chalk-soft)]"> / {totalQuestions}</span>
                    </p>
                </div>

                <ul>
                    {answersLog.map((log, index) => (
                        <li
                            key={index}
                            className="py-4 border-b border-[var(--color-paper-line)] dark:border-[var(--color-slate-line)] last:border-b-0"
                        >
                            <div className="flex justify-between">
                                <p className="flex-1">{index + 1}. {log.question}</p>
                                <span className={log.isCorrect ? "text-[var(--color-amber)]" : "text-[var(--color-brick)]"}>
                                    {log.isCorrect ? "✓" : "✗"}
                                </span>
                            </div>
                            <p className="text-sm text-[var(--color-ink-soft)] dark:text-[var(--color-chalk-soft)] mt-1">
                                {dict.yourAnswer} {log.userAnswer}
                            </p>
                            {!log.isCorrect && (
                                <p className="text-sm text-[var(--color-brick)] mt-1">
                                    {dict.correctAnswer} {log.correctAnswer}
                                </p>
                            )}
                        </li>
                    ))}
                </ul>
            </main>
        );
    }

    const currentQuestion = questions[activeQuestion];
    const progressPercent = ((activeQuestion) / totalQuestions) * 100;

    return (
        <main className="max-w-[740px] mx-auto px-4 py-10">
            <div className="flex items-center justify-between mb-2 text-sm text-[var(--color-ink-soft)] dark:text-[var(--color-chalk-soft)]">
                <span>{dict.progress.replace("{current}", activeQuestion + 1).replace("{total}", totalQuestions)}</span>
            </div>
            <div className="h-1.5 rounded-full bg-[var(--color-paper-line)] dark:bg-[var(--color-slate-line)] mb-10 overflow-hidden">
                <div
                    className="h-full bg-[var(--color-amber)] rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            <h2 className="text-2xl font-bold mb-8 leading-relaxed">{currentQuestion.question}</h2>

            <ul className="mb-8 rounded-lg overflow-hidden border border-[var(--color-paper-line)] dark:border-[var(--color-slate-line)]">
                {answerPromises.map((promise, index) => (
                    <Suspense
                        key={index}
                        fallback={
                            <li className="px-4 py-4 border-b border-[var(--color-paper-line)] dark:border-[var(--color-slate-line)] last:border-b-0">
                                <Skeleton
                                    height={20}
                                    baseColor="var(--color-paper-line)"
                                    highlightColor="var(--color-paper)"
                                />
                            </li>
                        }
                    >
                        <AnswerOption
                            promise={promise}
                            index={index}
                            getOptionClass={getOptionClass}
                            onSelect={handleAnswerSelection}
                        />
                    </Suspense>
                ))}
            </ul>

            <button
                onClick={handleNext}
                disabled={!selectedAnswer}
                className="w-full py-3.5 rounded-full font-semibold transition-opacity
                    bg-[var(--color-amber)] text-[var(--color-amber-ink)]
                    disabled:opacity-40 disabled:cursor-not-allowed
                    enabled:hover:opacity-90"
            >
                {activeQuestion === totalQuestions - 1 ? dict.finishBtn : dict.nextBtn}
            </button>
        </main>
    );
}
