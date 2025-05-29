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
                     I'm an aspiring frontend engineer and full-stack web developer passionate about building dynamic, user-centered digital experiences. With a strong foundation in UI design and web technologies, I focus on crafting responsive, visually engaging interfaces while actively expanding my backend skills to support scalable, data-driven applications. I'm especially interested in the intersection of web development, financial data visualization, and modern tooling—continuously learning and building to grow into a well-rounded developer ready to contribute to innovative, fast-moving teams.
                    </p>
                    <p className="mt-4 text-sm font-semibold text-blue-300 tracking wider">
                       ✱ BASED IN THE UNITED STATES
                    </p>
                </div>
            </div>
        </section>
    );                 
}