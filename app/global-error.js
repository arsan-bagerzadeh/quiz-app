"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <h1>Global Error!</h1>

        <p>{error.message}</p>

        <button onClick={() => reset()}>
          Try again
        </button>
      </body>
    </html>
  );
}