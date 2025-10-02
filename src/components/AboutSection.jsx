import React, { lazy, Suspense } from "react";
import profilePic from "../assets/myimage.png";
const Spline = lazy(() => import('@splinetool/react-spline'));

export default function AboutSection() {
    return (
        <section 
            id="about" 
            className="relative w-full min-h-screen flex items-center justify-center px-6 md:px-12 border-none"
        > 
            {/* Content */}
            <div className="relative z-10 w-full max-w-7xl flex flex-col md:flex-row items-center justify-between gap-10">
                {/* Left: Image Box */}
                <div className="bg-white/95 text-black rounded-2xl p-6 shadow-xl max-w-md w-full">
                    <img 
                        src={profilePic} 
                        alt="Jonathan Mirabal" 
                        className="rounded-xl w-full object-cover" 
                    />
                </div>

                <div className="text-left max-w-xl mt-10 md:mt-0 md:ml-16">
                    <h2 
                        className="text-3xl md:text-5xl font-extrabold tracking-tight text-white/90 
                                    drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] mb-4"
                    >
                        About Me
                    </h2>

                    <p className="mt-4 text-white/90 text-xl leading-relaxed drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">
                    I’m a <span className="font-semibold">frontend-first software engineer</span> who 
                    loves turning ideas into fast, accessible, and polished web 
                    interfaces. I enjoy clean UI, thoughtful details, and building
                    components that are easy to reuse and scale.
                    </p>

                    <p className="mt-4 text-white/90 leading-relaxed text-lg drop-shadow-[0_1px_3px_rgba(0,0,0,0.7)]">
                    My everyday toolkit is <span className="font-semibold">React</span>,{" "}
                    <span className="font-semibold">Next.js</span>,{" "}
                    <span className="font-semibold">TypeScript</span>, and{" "}
                    <span className="font-semibold">JavaScript</span>, and{" "}
                    <span className="font-semibold">Tailwind CSS</span>. I care about
                        accessibility, performance, and clear code — so the experience feels
                        fast, readable, and reliable.
                    </p>

                    <ul className="mt-6 space-y-3 text-white/90 leading-relaxed text-base">
                        <li className="flex gap-3">
                            <span className="mt-[6px] h-2 w-2 rounded-full bg-white/70" />
                            <span>
                                <span className="font-medium">How I work:</span> Ship
                                iteratively, name things clearly, document as I go, and keep PRs
                                easy to read.
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <span className="mt-[6px] h-2 w-2 rounded-full bg-white/70" />
                            <span>
                                <span className="font-medium">What I value:</span> Simple
                                architectures, predictable state, smooth interactions, and 
                                designs that make information easy to scan.
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <span className="mt-[6px] h-2 w-2 rounded-full bg-white/70" />
                            <span>
                                <span className="font-medium">Where I'm headed:</span> Growing
                                as a Frontend Engineer–deeper in accessibility, performance, and
                                UI systems–with the range to own end-to-end products.
                            </span>
                        </li>
                    </ul>

                    <p className="mt-6 text-sm font-semibold text-blue-300/90 tracking wider">
                    ✱ BASED IN THE UNITED STATES
                    </p>
                </div>
            </div>
        </section>
    );                 
}