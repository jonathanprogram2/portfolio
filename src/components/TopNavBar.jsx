import React, { useState, useEffect, useCallback } from "react";

// tiny inline envelope icon (no extra deps)
function EnvelopeIcon({ className = "w-5 h-5"}) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <path d="M3.5 7.5l7.6 5.1c.56.38 1.24.38 1.8 0l7.6-5.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="3" y="5" width="18" height="14" rx="2.4" stroke="currentColor" strokeWidth="1.6"/>
        </svg>
    );
}

const CONTACT_OFFSET = 300;

export default function TopNav({ anchors = [] }) {
    const [open, setOpen] = useState(false);
    const [home, about, work, services, contact] = anchors;

    // close drawer if we resize to desktop
    useEffect(() => {
        const onResize = () => { if (window.innerWidth >= 900 && open) setOpen(false); };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [open]);

    const handleNav = useCallback((anchor) => {
        setOpen(false);

        const contactAnchor = contact || "contact";

        // Contact link from navbar
        if (anchor === contactAnchor) {
            const el = 
                document.querySelector(`[data-anchor="${anchor}"]`) || 
                document.getElementById(anchor);

            if (el) {
                const rect = el.getBoundingClientRect();
                const scrollTop = window.scrollY || window.pageYOffset;
                const targetY = rect.top + scrollTop - CONTACT_OFFSET;

                window.scrollTo({
                    top: targetY,
                    behavior: "smooth",
                });
            }

            window.location.hash = `#${anchor}`;
            return;
        }
        // use fullPage.js if present; otherwise smooth scroll fallback
        if (window?.fullpage_api?.moveTo) {
            window.fullpage_api.moveTo(anchor);
        } else {
            const el = 
                document.querySelector(`[data-anchor="${anchor}"]`) || 
                document.getElementById(anchor);

            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
            }

            window.location.hash = `#${anchor}`;
        }
    }, [contact]);


    return (
        <>
            {/* Click outside overlay (closes menu of hamburger icon) */}
            {open && (
                <button
                    aria-label="Close menu"
                    className="fixed inset-0 z-[90] cursor-default"
                    onClick={() => setOpen(false)}
                />
            )}
            <nav 
                aria-label="Main navigation"
                className={[
                    // MOBILE: centered in the middle of the screen
                    "fixed z-[100] max-[900px]:left-1/2 max-[900px]:top-[max(12px,env(safe-area-inset-top))] max-[900px]:-translate-x-1/2",
                    "max-[900px]:w-[min(320px,92vw)]",       // small pill on mobile
                    // DESKTOP: back to top bar
                    "min-[901px]:top-[max(12px,env(safe-area-inset-top))] min-[901px]:left-1/2 min-[901px]:-translate-x-1/2 min-[901px]:translate-y-0",
                    "min-[901px]:w-[min(1100px,92vw)]",
                ].join(" ")}
            >
                {/* Glass pill */}
                <div className="nav-glass nav-glass--fx rounded-[22px] px-3 py-1.5 min-[901px]:rounded-[26px] min-[901px]:px-6 min-[901px]:py-2.5 relative jamx-nav">
                    <span className="nav-shine pointer-events-none absolute inset-0 rounded-[inherit]" aria-hidden />

                    {/* Make this a 3-column GRID */}
                    <div className="grid grid-cols-[auto_1fr_auto] gap-3 min-[901px]:gap-4 items-center text-white">
                        {/* LEFT: mobile hamburger / desktop inline menu */}
                        <div className="flex items-center">
                            {/* mobile hamburger */}
                            <button
                                type="button"
                                aria-label="Toggle menu"
                                aria-expanded={open}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setOpen((v) => !v);
                                    

                                }}
                                className="max-[900px]:flex min-[901px]:hidden h-9 w-9 items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/15"
                            >
                                <span className="sr-only">Toggle menu</span>
                                <svg 
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    className="w-6 h-6"
                                    aria-hidden="true"
                                >
                                    <path
                                        fill="none"
                                        stroke="#fff"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 17h14M5 12h14M5 7h14"
                                    />
                                </svg>
                            </button>

                            {/* Desktop links (keep id="menu" for fullpage.js) */}
                            <ul id="menu" className="hidden min-[901px]:flex items-center gap-6">
                                <li data-menuanchor={about}>
                                    <a href={`#${about}`} className="nav-link glow-link"
                                        onClick={(e)=>{ e.preventDefault(); handleNav(about); }}>
                                        ABOUT
                                    </a>
                                </li>
                                <li data-menuanchor={work}>
                                    <a href={`#${work}`} className="nav-link glow-link"
                                    onClick={(e)=>{ e.preventDefault(); handleNav(work); }}>
                                        WORK
                                    </a>
                                </li>
                                <li data-menuanchor={services}>
                                    <a href={`#${services}`} className="nav-link glow-link"
                                        onClick={(e)=>{ e.preventDefault(); handleNav(services); }}>
                                        SERVICES
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* CENTER BRAND */}
                        <div className="justify-self-center min-[901px]:mr-32">
                            <a
                                href={`#${home || "home"}`}
                                onClick={(e)=>{ e.preventDefault(); handleNav(home || "home"); }}
                                className="justify-self-center brand font-brand font-extrabold tracking-[0.06em] text-white/95"
                            >
                                JAMX <span className="opacity-85">STUDIOS</span>     
                            </a>
                        </div>

                        {/* RIGHT: CTA & Mobile envelope */}
                        <div className="justify-self-end">
                            <a
                                data-menuanchor={contact}
                                href={`#${contact || "contact"}`}
                                onClick={(e)=>{ e.preventDefault(); handleNav(contact || "contact"); }}
                                className="hidden min-[901px]:inline-block nav-cta pulse-cta px-4 md:px-5 py-2 text-white font-semibold rounded-full"
                            >
                                <span className="icon-glow">Contact me</span>
                            </a>

                            {/* mobile envelope icon */}
                            <button
                                onClick={() => handleNav(contact || "contact")}
                                aria-label="Contact"
                                className="min-[901px]:hidden inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-teal-300"
                            >
                                <EnvelopeIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                        

                    {/* mobile dropdown */}
                    {open && (
                        <div 
                            className="
                                min-[901px]:hidden absolute left-2 right-2 top-full mt-2
                                rounded-2xl bg-black/80 border border-white/15 backdrop-blur-md p-2
                            "
                        >
                            <ul className="flex flex-col">
                                {[about, work, services].filter(Boolean).map((a) => (
                                    <li key={a}>
                                        <button
                                            onClick={() => handleNav(a)}
                                            className="
                                                w-full text-left px-3 py-3 rounded-xl
                                                text-[14px] font-semibold uppercase
                                                text-white/90 hover:text-white hover:bg-white/10
                                            "
                                        >
                                            {a}
                                        </button>
                                    </li>
                                ))}
                                {contact && (
                                    <li>
                                        <button
                                            onClick={() => handleNav(contact)}
                                            className="w-full text-left px-3 py-3 rounded-xl text-[14px] font-semibold uppercase text-white/90 hover:text-white hover:bg-white/10"
                                        >
                                            {contact}
                                        </button>
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
            </nav>
        </>
    );
}