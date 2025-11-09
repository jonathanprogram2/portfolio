import React from "react";
import { motion } from "framer-motion";
import myLogo from "../../assets/mylogo.png";

const LINKS = [ 
    { label: "ABOUT", href: "#about" },
    { label: "WORK", href: "#work" },
    { label: "SERVICES", href: "#services" },
    { label: "CONTACT", href: "#contact" },
];

export default function FooterSection() {
    return (
        <section id="footer" className="section w-full fp-auto-height bg-[#000000] pt-10 md:pt-14 text-white">
            <div className="w-full max-w-[1200px] mx-auto px-6 py-12 md:py-16">
                {/* top divider */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* logo */}
                <div className="py-6 md:py-8 grid place-items-center">
                    <motion.img
                        src={myLogo}
                        alt="Logo"
                        className="h-14 w-14 object-contain rounded-full"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.06, filter: "drop-shadow(0 0 24px rgba(178,147,255,.5))" }}
                        transition={{ type: "spring", stiffness: 220, damping: 18 }}
                    />
                </div>

                {/* middle divider */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* nav links */}
                <nav className="flex justify-center gap-8 md:gap-12 py-6">
                    {LINKS.map((l) => (
                        <a
                            key={l.label}
                            href={l.href}
                            className="glow-link text-white/80 hover:text-white transition"
                        >
                            {l.label}
                        </a>
                    ))}
                </nav>

                {/* bottom divider */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* bottom row */}
                <div className="pt-6 flex items-center justify-between gap-6 flex-wrap text-sm text-white/60">
                    <span>© {new Date().getFullYear()} JAMX STUDIOS</span>

                    {/* socials */}
                    <div className="flex items-center gap-5">
                        <a className="icon-glow" href="https://github.com/jonathanprogram2" target="_blank" rel="noreferrer" aria-label="GitHub">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.1.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.72.08-.72 1.2.08 1.83 1.23 1.83 1.23 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.77-1.61-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.39 1.23-3.23-.12-.3-.53-1.52.12-3.17 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.29-1.23 3.29-1.23.66 1.65.24 2.87.12 3.17.77.84 1.23 1.92 1.23 3.23 0 4.61-2.8 5.62-5.47 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.21.69.83.57A12 12 0 0 0 12 .5Z"/></svg>
                        </a>
                        <a className="icon-glow" href="https://www.linkedin.com/in/jonathanmirabal/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M6 9H3v12h3V9Zm.34-6.5A1.84 1.84 0 1 0 6.33 6a1.84 1.84 0 0 0 .01-3.5ZM21 21h-3v-6.5c0-3.47-4-3.2-4 0V21h-3V9h3v1.77c1.4-2.59 9-2.78 9 2.48V21Z"/></svg>
                        </a>
                    </div>

                    <a href="#footer" className="text-white/60 hover:text-white transition">ALL RIGHTS RESERVED • PRIVACY POLICY • TERMS OF SERVICE • CONTACT</a>
                </div>
            </div>
        </section>
    );
}