'use client'
import { useEffect } from "react"
export default function Error({ error, reset }) {
    useEffect(() => {
        console.log(error);
    }, [error])

    return (
        <div className="container">
            <div className="quiz-container">
                <h2>مشکل پیش اومده😊</h2>
                <button onClick={() => reset()}>تلاش مجدد</button>
            </div>
        </div>
    )
}