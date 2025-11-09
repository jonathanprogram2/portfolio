import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { getGPUTier } from "detect-gpu";
import SuperformulaBackground from "../SuperformulaBackground";


/**
 * Minimal 2D fallback (purple bg + headline/buttons).
 *  style the headline via the existing CSS (for ex, .headline-gradient)
 */

function FallbackHero({ rX, rY }) {
    return (
        <>
        {/* content */}
        <div className="relative h-full w-full flex items-center justify-center z-20">
            <div className="text-center px-6">
                <motion.h1
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    style={{ rotateX: rX, rotateY: rY, transformStyle: "preserve-3d", fontSize: "min(12vw, 120px)", color: "white" }}
                    className="font-extrabold leading-[0.9]"
                >
                    Designing the
                    <br />
                    Future
                    <br />
                    of the Web
                </motion.h1>

                
                <a href="#work" className="neon-btn neon-left is-cyan" aria-label="Step into our world">
                    <span></span><span></span><span></span><span></span>
                    Step into our world
                </a>
                <a href="#services" className="neon-btn neon-right is-magenta" aria-label="Our Services">
                    <span></span><span></span><span></span><span></span>
                    Our Services 
                </a>
            </div>
        </div>
        </>
    );
}




export default function HeroSection() {
    // Shared cursor driver (used by both the headline tilt and the 3D scene)
    const mx = useMotionValue(0);
    const my = useMotionValue(0);


    // Subtle 3D tilt on the headline
    const rX = useTransform(my, [-0.5, 0.5], [4, -4]);
    const rY = useTransform(mx, [-0.5, 0.5], [-4, 4]);



    return (
        <section className="relative h-[100svh] w-full overflow-hidden">
            {/* Superformula background */}
            <div id="scene-container" className="fixed inset-0 z-10 pointer-events-none" />
            <SuperformulaBackground />

            {/* Fallback / also the visible hero content */}
            <FallbackHero rX={rX} rY={rY} />
        </section>
    );
}