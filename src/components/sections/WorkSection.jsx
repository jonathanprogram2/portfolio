'use client';
import { useEffect, useRef }from 'react';
import { contain } from 'three/src/extras/TextureUtils.js';

// minimal project data - swap/extend as you like
const PROJECTS = [
    {
        id: "space",
        title: "Space Tourism Website",
        img: "/assets/projects/space/space-hero.png",
        href: "https://space-tourism-jonathan.vercel.app/",
        imgPos: "10% 50%",
    },
    {
        id: "finance",
        title: "OBEL: Finance Tracker",
        img: "/assets/projects/obel/obel-dashboard.png",
        href: "https://github.com/jonathanprogram2/obel",
        imgPos: "3% 50%",
    },
    {
        id: "productivity",
        title: "Focus Pocus: Productivity Android App",
        img: "/assets/projects/focus-pocus/focus-strip.png",
        href: "https://github.com/jonathanprogram2/FocusPocusApp",
        imgPos: "50% 50%",
    },
];


export default function WorkSection() {
    const containerRef = useRef(null);
    const scrollerRef  = useRef(null);
    const barRef       = useRef(null);
    const counterRef   = useRef(null);

    // perf refs
    const targetX = useRef(0);
    const currentX = useRef(0);
    const animating = useRef(false);
    const reqId = useRef(0);
    const progressScale = useRef(0);
    const progressTarget = useRef(0);
    const lastPct = useRef(0);
    const seqW = useRef(0);
    const buffer = 2;    // clones before/after
    const smooth = 0.08; // lerp factor
    const touchVelocity = useRef(0);
    const isDown = useRef(false);
    const lastTouchX = useRef(0);
    const lastTouchT = useRef(0);

    useEffect(() => {
        const container = containerRef.current;
        const scroller  = scrollerRef.current;
        const bar       = barRef.current;
        const counter   = counterRef.current;

        // reduced motion fallback (just show vertical stacked content)
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) {
            container.style.position = 'relative';
            container.style.height = 'auto';
            scroller.style.position = 'relative';
            scroller.style.width = '100%';
            scroller.style.transform = 'none';
            bar.style.display = 'none';
            counter.parentElement.style.display = 'none';
            return;
        }

        // build infinite sequence (clone sections)
        const setup = () => {
            // clear old clones
            scroller.querySelectorAll('.clone').forEach(n => n.remove());

            const originals = Array.from(scroller.querySelectorAll('section.base'));
            let width = 0;
            originals.forEach(s => (width += parseFloat(getComputedStyle(s).width)));

            // prepend clones
            for (let i = -buffer; i < 0; i++) {
                originals.forEach((s, idx) => {
                    const c = s.cloneNode(true);
                    c.classList.add('clone');
                    c.setAttribute('data-clone', `${i}-${idx}`);
                    scroller.appendChild(c);
                });
            }
            
            // append clones
            for (let i = 1; i <= buffer; i++) {
                originals.forEach((s, idx) => {
                    const c = s.cloneNode(true);
                    c.classList.add('clone');
                    c.setAttribute('data-clone', `${i}-${idx}`);
                    scroller.appendChild(c);
                });
            }

            scroller.style.width = `${width * (1 + buffer * 2)}px`;
            seqW.current = width;
            targetX.current = width * buffer;
            currentX.current = targetX.current;
            scroller.style.transform = `translate3d(-${currentX.current}px,0,0)`;
            updateProgress(true);
        };

        const lerp = (a, b, t) => a + (b - a) * t;

        const checkBoundary = () => {
            const w = seqW.current;
            if (currentX.current > w * (buffer + 0.5)) {
                targetX.current -= w;
                currentX.current -= w;
                scroller.style.transform = `translate3d(-${currentX.current}px,0,0)`;
                return true;
            }
            if (currentX.current < w * (buffer - 0.5)) {
                targetX.current += w;
                currentX.current += w;
                scroller.style.transform = `translate3d(-${currentX.current}px,0,0)`;
                return true;
            }
            return false;
        };

        const updateProgress = (forceReset = false) => {
            const w = seqW.current;
            const base = w * buffer;
            const cur = (currentX.current - base) % w;
            let pct = (cur / w) * 100;
            if (pct < 0) pct = 100 + pct;

            const wrapping =
                (lastPct.current > 80 && pct < 20) ||
                (lastPct.current < 20 && pct > 80) || forceReset;

            counter.textContent = String(Math.round(pct));
            progressTarget.current = pct / 100;

            if (wrapping) {
                progressScale.current = progressTarget.current;
                bar.style.transform = `scaleX(${progressScale.current})`;
            }
            lastPct.current = pct;
        };

        const animate = (forceReset = false) => {
            currentX.current = lerp(currentX.current, targetX.current, smooth);
            scroller.style.transform = `translate3d(-${currentX.current}px,0,0)`;

            updateProgress(forceReset);
            if (!forceReset) {
                progressScale.current = lerp(progressScale.current, progressTarget.current, smooth);
            }
            bar.style.transform = `scaleX(${progressScale.current})`;

            if (Math.abs(targetX.current - currentX.current) > 0.1) {
                animating.current = true;
                reqId.current = requestAnimationFrame(() => animate(false));
            } else {
                animating.current = false;
            }
        };

        // init
        setup();

        let wheelTimeout;
        // wheel
        const onWheel = (e) => {

            const dx = Math.abs(e.deltaX);
            const dy = Math.abs(e.deltaY);

            if (dy > dx) return;

            e.preventDefault();
            
            targetX.current += e.deltaX * 1.2;

            const needsReset = checkBoundary();
            clearTimeout(wheelTimeout)
            if (!animating.current) {
                animating.current = true;
                reqId.current = requestAnimationFrame(() => animate(needsReset));
            }

            wheelTimeout = setTimeout(() => {
                animating.current = false;
            }, 100);
        };

       


        // arrow-key navigation (left/right)
        const onKey = (e) => {
            if (document.activeElement !== container) return;  // only when focused
            const STEP = 120;  // tweak step size
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                targetX.current += STEP;
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                targetX.current -= STEP;
            } else {
                return;
            }
            const needsReset = checkBoundary();
            if (!animating.current) {
                animating.current = true;
                reqId.current = requestAnimationFrame(() => animate(needsReset));
            }
        };

        container.addEventListener('keydown', onKey);
        container.addEventListener('mouseenter', () => container.focus());

       

        // touch
        const onStart = (e) => {
            isDown.current = true;
            lastTouchX.current = (e.touches ? e.touches[0].clientX : e.clientX);
            lastTouchT.current = performance.now();
            targetX.current = currentX.current;
            touchVelocity.current = 0;
        };
        const onMove = (e) => {
            if (!isDown.current) return;
            e.preventDefault();
            const x = (e.touches ? e.touches[0].clientX : e.clientX);
            const dx = lastTouchX.current - x;
            targetX.current += dx * 2.5;

            const t = performance.now();
            const dt = t - lastTouchT.current;
            if (dt > 0) touchVelocity.current = (dx / dt) * 16;
            lastTouchX.current = x;
            lastTouchT.current = t;

            const needsReset = checkBoundary();
            if (!animating.current) {
                animating.current = true;
                reqId.current = requestAnimationFrame(() => animate(needsReset));
            }
        };
        const onEnd = () => {
            isDown.current = false;
            // simple inertial tail
            if (Math.abs(touchVelocity.current) > 0.1) {
                const decay = () => {
                    touchVelocity.current *= 0.94;
                    if (Math.abs(touchVelocity.current) > 0.1) {
                        targetX.current += touchVelocity.current * 14;
                        const needsReset = checkBoundary();
                        if (needsReset) updateProgress(true);
                        reqId.current = requestAnimationFrame(decay);
                    }
                };
                reqId.current = requestAnimationFrame(decay);
            }
        };

        const onDelegatedClick = (e) => {
            const slide = e.target.closest('.project-slide');
            if (!slide || !scroller.contains(slide)) return;
            const href = slide.getAttribute('data-href');
            if (href) window.open(href, '_blank', 'noopener,noreferrer');
        };

        const onDelegatedKey = (e) => {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            const slide = e.target.closest('.project-slide');
            if (!slide || !scroller.contains(slide)) return;
            e.preventDefault();
            const href = slide.getAttribute('data-href');
            if (href) window.open(href, '_blank', 'noopener,noreferrer');
        };

        scroller.addEventListener('click', onDelegatedClick);
        scroller.addEventListener('keydown', onDelegatedKey);

        // listeners
        container.addEventListener('wheel', onWheel, { passive: false });
        container.addEventListener('touchstart', onStart, { passive: true });
        container.addEventListener('touchmove', onMove, { passive: false });
        container.addEventListener('touchend', onEnd, { passive: true });
        // pointer (desktop drag)
        container.addEventListener('mousedown', onStart);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onEnd);

        // resize (rebuild widths + clones) — throttle + unobserve to avoid loop
        let rafId = 0;
        const onResize = () => {
            cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(setup);
        };
        window.addEventListener('resize', onResize)
       

        return () => {
            cancelAnimationFrame(reqId.current);
            container.removeEventListener('wheel', onWheel);
            container.removeEventListener('touchstart', onStart);
            container.removeEventListener('touchmove', onMove);
            container.removeEventListener('touchend', onEnd);
            container.removeEventListener('mousedown', onStart);
            container.removeEventListener('keydown', onKey);
            container.removeEventListener('mouseenter', () => container.focus());
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onEnd);
            window.removeEventListener('resize', onResize);
            scroller.removeEventListener('click', onDelegatedClick);
            scroller.removeEventListener('keydown', onDelegatedKey);
            cancelAnimationFrame(rafId);
        };
    }, []);

    return (
       <section id="work" className="work-wrap"  aria-label="Work">
            <div className="work-chipbar">
                <span className="chip-anim work-chip">WORK</span>
            </div>
            
            <section
                className="ihs-container ihs--tight"
                ref={containerRef} 
                tabIndex={0}
            >
                <div className="ihs-bar" ref={barRef} />
                <div className="ihs-counter"><h1 ref={counterRef}>0</h1></div>



                <div className="ihs-scroller" ref={scrollerRef}>
                    {/* 1 — Intro */}
                    <section className="ihs-section base ihs-intro">
                        <h1>Explore our Creations</h1>
                        <h2>Scroll sideways to cruise ← →  </h2>
                        <p class="hint">Click any project to explore</p>
                        
                    </section>
                    

                    {/* 2 — Project image track (you can sprinkle throughout)*/}
                    {PROJECTS.map(p => (
                        <section 
                            key={p.id} 
                            className="ihs-section base ihs-hero project-slide" 
                            style={{ '--img-pos': p.imgPos || '50% 50%' }} 
                            role="link" 
                            onClick={() => window.open(p.href, '_blank', 'noopener,noreferrer')}
                            data-href={p.href}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    window.open(p.href, '_blank', 'noopener,noreferrer');
                                }
                            }}
                        >
                            <img src={p.img} alt={p.title} draggable="false" />
                        </section>
                    ))}

                    {/* 3 — Header */}
                    <section className="ihs-section base ihs-header">
                        <h1>Design meets performance</h1>
                    </section>

                    {/* 4 — About / split copy + image */}
                    <section className="ihs-section base ihs-about">
                        <div className="row">
                            <div className="copy">
                                <p>We build fast, responsive, brand-aligned experiences.</p>
                                <p>From product UIs to immersive web-clean, modern, ship-ready.</p>
                            </div>
                        </div>
                        <h1>Built with intention</h1>
                    </section>

                    {/*Taglines */}
                    <section className="ihs-section base ihs-story">
                        <h1>Lead the league</h1>
                        <h1>Live the Detail</h1>
                        <h1>Defy every limit</h1>
                    </section>


                    {/* Outro */}
                    <section className="ihs-section base ihs-outro">
                        <h1>Tomorrow is Already Here</h1>
                    </section>
                </div>   
            </section> 
       </section>
    );
}