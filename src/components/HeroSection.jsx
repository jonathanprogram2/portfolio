import React, { lazy, Suspense } from "react";

// Lazy Load Spline
const Spline = lazy(() => import("@splinetool/react-spline"));

export default function HeroSection({ entered }) {
    if (!entered) return null;

    return (
        <section id="hero" className="relative w-screen h-screen overflow-hidden border-none bg-transparent shadow-none">
            
            {/* 🧠 Lazy Loaded Spline Robot Scene */}
            <Suspense fallback={<div className="absolute inset-0 bg-transparent" />}>
                <Spline 
                 scene="https://prod.spline.design/ofDB8ngiS3hIoWMk/scene.splinecode"
                 className="absolute top-0 left-0 w-full h-full"
                /> 
            </Suspense>
        </section>
    );
}    