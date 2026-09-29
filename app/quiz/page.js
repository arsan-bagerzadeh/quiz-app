"use client";
import { useEffect, useState, use, Suspense, useMemo } from "react";
import { quiz } from "../data";
import Skeleton from "react-loading-skeleton";
export default function Quiz() {
    const [activeQuestion, setActiveQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [checked, setChecked] = useState(false);
    const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
    const [showResult, setShowResult] = useState(false);
    // const [options, setOptions] = useState([]);
    const [result, setResult] = useState({
        score: 0,
        correctAnswers: 0,
        wrongAnswers: 0,
    });

    // useEffect(() => {
    //     setOptions([]);
    //     const timer = setTimeout(() => {
    //         setOptions(quiz.questions[activeQuestion].answers);
    //     }, 1000);

    //     return () => clearTimeout(timer);
    // }, [result]);
    function createDelayedAnswer(answer) {
        const delay = (1 + Math.floor(Math.random() * 4)) * 1000; // بین ۱ تا ۴ ثانیه، هر بار متفاوت
        return new Promise((resolve) => {
            setTimeout(() => resolve(answer), delay);
        });
    }

    function AnswerOption({ promise, index, getOptionClass, onSelect }) {
        const answer = use(promise); // فقط برای همین یه گزینه صبر می‌کنه

        return (
            <li
                className={getOptionClass(answer, index)}
                onClick={() => onSelect(answer, index)}
            >
                {answer}
            </li>
        );
    }

    function handleAnswerSelection(answer, index) {
        if (checked) return; // اگه جواب تایید شده، دیگه نذار عوض کنه
        setSelectedAnswer(answer);
        setSelectedAnswerIndex(index);
    }

    function getOptionClass(answer, index) {
        const currentQuestion = quiz.questions[activeQuestion];

        if (!checked) {
            // قبل از تایید: فقط انتخاب‌شده یا معمولی
            return index === selectedAnswerIndex ? "li-selected" : "li-hover";
        }

        // بعد از تایید:
        if (answer === currentQuestion.correctAnswer) {
            // جواب درست همیشه سبزه، چه انتخاب شده باشه چه نه
            return "li-correct";
        }

        if (index === selectedAnswerIndex) {
            // کاربر همینو انتخاب کرده بود ولی غلط بوده
            return "li-wrong";
        }

        // بقیه گزینه‌های غلط که انتخاب نشدن
        return "";
    }

    function handleNext() {
        if (!checked) {
            // مرحله ۱: تایید جواب و محاسبه امتیاز
            const isCorrect = selectedAnswer === quiz.questions[activeQuestion].correctAnswer;
            setChecked(true);
            setResult((prev) => ({
                score: isCorrect ? prev.score + 1 : prev.score,
                correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
                wrongAnswers: !isCorrect ? prev.wrongAnswers + 1 : prev.wrongAnswers,
            }));
        } else {
            // مرحله ۲: رفتن به سوال بعد یا نمایش نتیجه نهایی
            if (activeQuestion + 1 < quiz.totalQuestions) {
                setActiveQuestion((prev) => prev + 1);
                setSelectedAnswer("");
                setSelectedAnswerIndex(null);
                setChecked(false);
            } else {
                setShowResult(true);
            }
        }
    }

    const answerPromises = useMemo(
        () => quiz.questions[activeQuestion].answers.map((answer) => createDelayedAnswer(answer)),
        [activeQuestion]
    );
    // اگه به آخر کوییز رسیدیم و باید نتیجه رو نشون بدیم
    if (showResult) {
        return (
            <>
                <div className="container">
                    <h1>نتیجه آزمون</h1>
                    <div className="quiz-container">
                        <h2>
                            امتیاز شما: {result.score} از {quiz.totalQuestions}
                        </h2>
                        <p>تعداد جواب‌های درست: {result.correctAnswers}</p>
                        <p>تعداد جواب‌های غلط: {result.wrongAnswers}</p>
                    </div>
                </div>
            </>
        );
    }

    // در غیر این صورت، سوال فعلی رو نشون بده
    const currentQuestion = quiz.questions[activeQuestion];

    return (
        <>
            
                <h1>اپلیکیشن Quiz</h1>
                
                <div className="quiz-container">
                    <h3>
                        سوال {activeQuestion + 1} از {quiz.totalQuestions}
                    </h3>
                    <h2>{currentQuestion.question}</h2>
                    <ul>
                        {answerPromises.map((promise, index) => (
                            <Suspense key={index} fallback={<li><Skeleton height={40} /></li>}>
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
                        className={!selectedAnswer ? "btn-disabled" : ""}
                        disabled={!selectedAnswer}
                        onClick={handleNext}
                    >
                        {activeQuestion === quiz.totalQuestions - 1 && checked ? "پایان" : checked ? "سوال بعدی" : "تایید جواب"}
                    </button>
                </div>
            
        </>
    );

}