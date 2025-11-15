import React, { useCallback } from "react";
import { motion } from "framer-motion";

function ServiceCard({ eyebrow, title, price, bullets = [], note, cta = "Lock in your project today" }) {
    // mouse spotlight 
    const onMove = useCallback((e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        e.currentTarget.style.setProperty("--mx", `${x}px`);
        e.currentTarget.style.setProperty("--my", `${y}px`);
    }, []);

    return (
        <motion.div
            onMouseMove={onMove}
            className="service-card group relative rounded-2xl border border-white/10 bg-white/[0.04] p-6 md:p-8"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut"}}
        >
            <div className="text-sm font-semibold text-[#b293ff] mb-2">{eyebrow}</div>
            <div className="flex items-baseline gap-3">
                <h3 className="text-3xl md:text-4xl font-extrabold text-white">{title}</h3>
                {price && <span className="text-white/70 font-semibold">{price}</span>}
            </div>

            <ul className="mt-5 space-y-3 text-white/85">
                {bullets.map((b, i) => (
                    <li key={i} className="flex gap-3">
                        <span className="mt-1 h-4 w-4 rounded-full border border-white/30 grid place-items-center">
                            <span className="h-2 w-2 rounded-full bg-white/80" />
                        </span>
                        <span>{b}</span>
                    </li>
                ))}
            </ul>

            {note && <p className="text-white/60 text-sm mt-4">{note}</p>}

            <div className="mt-8">
                <a href="#contact" className="inline-flex items-center gap-2 rounded-xl bg-white text-black font-semibold px-4 py-2 shadow-[0_10px_30px_rgba(0,0,0,.25)] group-hover:translate-y-[-2px] transition">
                    {cta} <span aria-hidden>→</span>
                </a>
            </div>

            {/* soft outline on hover */}
            <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/0 group-hover:ring-white/15 transition" />
        </motion.div>
    );
}

export default function ServicesSection() {
    return (
        <section className="w-full bg-[#000000] scroll-mt-28 md:scroll-mt-40 mt-[5rem] md:mt-24 text-white">
            <div className="w-full max-w-[1200px] mx-auto px-6 pt-0 md:pt-20 pb-1 md:pb-6">
                {/* label + heading */}
                <div className="text-center mb-2 services-wrap">
                    <span className=" chip-anim ">
                        Services
                    </span>
                </div>
                <h2 className="text-center text-4xl md:text-6xl font-extrabold leading-[1.1]">
                    Igniting ideas, crafting digital worlds
                </h2>
                <p className="text-center text-white/75 mt-3 max-w-2xl mx-auto">
                    Strap in — we're taking your brand from concept to orbit with a website that
                    commands attention and converts.
                </p>

                {/* cards grid (2x2) */}
                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <ServiceCard
                        eyebrow="Launch Tier"
                        title="From $2,800"
                        price="*ignite package"
                        bullets={[
                            "3-4 core pages (Home, About, Services, Contact)",
                            "Responsive, modern, brand-aligned UI across devices",
                            "Basic animations + accessibility baked in",
                            "Baseline SEO startup",
                            "Hosting + deployment support",
                        ]}
                        note="Perfect for founders ready to take their first digital leap. Fast, sleek, and future-proof."
                    />

                    <ServiceCard
                        eyebrow="Growth Tier"
                        title="From $5,600"
                        price="*ascend package"
                        bullets={[
                            "E-commerce or advanced landing site",
                            "Conversion-focused copy framing",
                            "Custom animations & motion polish",
                            "Analytics + SEO integration",
                            "Self-manageable CMS or Shopify setup",
                            "Multi-language or scaling support",
                        ]}
                        note="Tailored design meets performance engineering. Built to convert, scale, and impress."
                    />

                    <ServiceCard
                        eyebrow="Power Tier"
                        title="From $8,000+"
                        price="*dominion package"
                        bullets={[
                            "Advanced dashboards or web apps",
                            "Custom backend or API integrations",
                            "CRM / payment integrations",
                            "3D UI elements, complex motion",
                            "Enterprise-grade SEO + optimization",
                        ]}
                        note="Full-scale digital dominance. For companies ready to lead their industry into the next era."
                    />

                    <ServiceCard
                        eyebrow="Premium Boosters"
                        title="Optional Add-ons"
                        bullets={[
                            "“Website in a Week” build sprint — +$500-$1,000 (custom quote)",
                            "Brand Identity System (Logo, color palette, fonts) — +$700",
                            "Conversion Audit & Optimization — +$600",
                            "Multi-language Support — +$400",
                            "Integrations (CRMs, payments, APIs)",
                            "Animations, 3D and advanced UI work",
                        ]}
                    />
                </div>

                {/* subtle divider */}
                <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-white/12 to-transparent" />
            </div>
        </section>
    );
}