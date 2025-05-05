import React, { lazy, Suspense } from "react";
import profilePic from "../assets/myimage.png";
const Spline = lazy(() => import('@splinetool/react-spline'));

export default function AboutSection() {
    return (
        <section id="about" className="relative w-full min-h-screen flex items-center justify-center px-6 md:px-12 border-none">
            {/* Spline Background */}
                <Spline scene="https://prod.spline.design/pOn5sMDiRPgxoOTN/scene.splinecode" className="absolute top-0 left-0 w-full h-full z-0" />
            
            {/* Content */}
            <div className="relative z-10 w-full max-w-7xl flex flex-col md:flex-row items-center justify-between px-6 md:px-12">
                {/* Left: Image Box */}
                <div className="bg-white text-black rounded-2xl p-6 shadow-xl max-w-md w-full">
                    <img src={profilePic} alt="Jonathan Mirabal" className="rounded-xl w-full" />
                </div>

                {/* Right: Text */}
                <div className="text-left max-w-xl mt-10 md:mt-0 md:ml-16">
                    <p className="text-white text-lg leading-relaxed font-light">
                    I’m an aspiring software engineer with a bold interest in bridging frontend engineering, user experience design, and financial data applications. As a computer science student, I’m dedicated to crafting intuitive, interactive web interfaces while actively expanding my skills in data visualization, fintech tools, and blockchain technologies. Through hands-on projects, I’ve begun blending design with data to create engaging digital experiences—building a foundation in both frontend development and the technical side of financial engineering. I’m eager to apply my creativity, curiosity, and growing expertise to innovative teams shaping the future of fintech, Web3, and data-driven platforms.
                    </p>
                    <p className="mt-4 text-sm font-semibold text-blue-300 tracking wider">
                       ✱ BASED IN THE UNITED STATES
                    </p>
                </div>
            </div>
        </section>
    );                 
}