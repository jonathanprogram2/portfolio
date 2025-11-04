import React from "react";

export default function TopNav({ anchors = [] }) {
    const [home, about, work, services, contact] = anchors;

    return (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] w-[min(1100px,92vw)]">
            <div className="nav-glass relative flex items-center justify-between rounded-full px-5 sm:px-6 py-3">
                <span className=" nav-shine pointer-events-none absolute inset-0 rounded-full" aria-hidden />
        
                {/* LEFT: menu list controlled by fullPage.js */}
                <ul id="menu" className="flex items-center gap-6 sm:gap-8">
                    <li data-menuanchor={about}>
                        <a
                            href={`#${about}`}
                            className="nav-link glow-link"
                        >
                            ABOUT
                        </a>
                    </li>
                    <li data-menuanchor={work}>
                        <a
                            href={`#${work}`}
                            className="nav-link glow-link"
                        >
                            WORK
                        </a>
                    </li>
                    <li data-menuanchor={services}>
                        <a
                            href={`#${services}`}
                            className="nav-link glow-link"
                        >
                            SERVICES
                        </a>
                    </li>
                </ul>

                {/* CENTER BRAND */}
                <a
                    href={`#${home || "home"}`}
                    className="
                     brand absolute left-1/2 -translate-x-1/2
                     font-brand font-extrabold tracking-[0.06em]
                     text-white/95
                    "
                >
                    JAMX <span className="opacity-85">STUDIOS</span>     
                </a>

                {/* RIGHT: CTA */}
                <a
                    data-menuanchor={contact}
                    href={`#${contact || "contact"}`}
                    className="
                      nav-cta pulse-cta
                       px-4 sm:px-5 py-2
                      text-white font-semibold 
                    "
                >
                    <span className="icon-glow">Contact me</span>
                </a>
            </div>
        </div>
    );
}