import React from "react";
import { easeOut, motion } from "framer-motion";
import profilePic from "../../assets/myimage.png";
import { transition } from "three/examples/jsm/tsl/display/TransitionNode.js";

export default function AboutSection() {
    const textFade = {
        hidden: { opacity: 0, y: 40 },
        visible: (i = 1) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
        }),
    };

    return (
        <section className="h-full w-full flex items-center justify-center bg-[#000000] text-white px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center max-w-7xl gap-12">
                {/* LEFT: PROFILE IMAGE */}
                <motion.div
                    initial={{ opacity: 0, x: -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true, amount: 0.3 }}
                    className="rounded-3xl overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,.5)] group"
                >
                    <img
                        src={profilePic}
                        alt="Jonathan Mirabal"
                        className="w-full h-[70vh] object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out"
                    />
                </motion.div>

                {/* RIGHT: TEXT AREA */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.4 }}
                    className="max-w-[600px]"
                >
                    
                    <motion.span
                        variants={textFade}
                        custom={0}
                        className="chip-anim mb-4 text-sm"
                    >
                        ABOUT
                    </motion.span>

                    {/* title — slide each word up */}
                    <h2 className="text-6xl md:text-7xl font-extrabold leading-[1.05] mb-6">
                        <div className="about-fly">
                            <div>Creative Technologist</div>
                            <div>Visual Designer</div>
                            <div>Web Creator</div>
                        </div>
                    </h2>

                    {/* paragraph copy */}
                    <motion.p
                        variants={textFade}
                        custom={3}
                        className="text-lg leading-relaxed text-white/80"
                    >
                        At JAMX STUDIOS, we transform imagination into{" "}
                        <b>visually unforgettable digital experiences </b>
                        built for the modern web.
                        Founded by Jonathan Mirabal from Ohio, the studio merges
                        <b> futuristic design and high-performing interfaces </b> 
                        to build living digital experiences that move, inspire, and captivate.
                        <b> We build the future — one pixel at a time.</b>
                    </motion.p>
                </motion.div>
            </div>
        </section>
    );
}