import React, { lazy, Suspense } from "react";

// Lazy Load Spline
const Spline = lazy(() => import("@splinetool/react-spline"));


export default function ProjectsSection() {
    return (
        <section id="projects" className="relative w-full min-h-screen overflow-hidden">
            <Suspense fallback={<div className="absolute inset-0 bg-black" />}>
                <Spline
                    scene="https://prod.spline.design/J-MXuGNATjE1Fao6/scene.splinecode"
                    className="absolute top-0 left-0 w-full h-full"
                />    
            </Suspense>
        </section>
    );
}