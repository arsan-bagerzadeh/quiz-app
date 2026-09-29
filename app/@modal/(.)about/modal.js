"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";

export function Modal({ children }) {
    const router = useRouter();
    const dialogRef = useRef(null);

    useEffect(() => {
        if (!dialogRef.current?.open) {
            dialogRef.current?.showModal();
        }
    }, []);

    function onDismiss() {
        router.back();
    }

    return (
        <div className="modal-backdrop">
            <dialog ref={dialogRef} className="modal" onClose={onDismiss}>
                {children}
                <button onClick={onDismiss} className="close-button">✕</button>
            </dialog>
        </div>
       
    );
}