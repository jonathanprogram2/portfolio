'use client';


import { Swiper, SwiperSlide} from 'swiper/react';
import { Scrollbar } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/scrollbar';

// My Projects
const PROJECTS = [
    {
        id: 'space',
        title: 'Space Tourism Website',
        subtitle: 'Multi-page React Space Tour UI',
        img: '/assets/projects/space/space-hero.png',
        href: 'https://space-tourism-jonathan.vercel.app/',
    },
    {
        id: 'finance',
        title: 'OBEL: Finance Tracker',
        subtitle: 'Stock portfolio + analytics dashboard',
        img: '/assets/projects/obel/obel-dashboard.png',
        href: 'https://github.com/jonathanprogram2/obel',
    },
    {
        id: 'productivity',
        title: 'Focus Pocus: Productivity Android App',
        subtitle: 'Gamified productivity mobile app',
        img: '/assets/projects/focus-pocus/focus-strip.png',
        href: 'https://github.com/jonathanprogram2/FocusPocusApp',
    },
];


export default function WorkSection() {
    return (
       <section id="work" className="work-wrap py-24 max-[900px]:-mt-30">
            <div id="work-chip" className="work-chipbar chip-chip-work">
                <span className="chip-anim work-chip">WORK</span>
            </div>

            <section className="work-slider-shell">
                <div className="work-slider-container">
                    <h2 className="work-slider-heading">Our Collection</h2>

                    <Swiper
                        className="work-swiper"
                        modules={[Scrollbar]}
                        scrollbar={{
                            el: '.work-swiper-scrollbar',
                            draggable: true,
                        }}
                        slidesPerView={1}
                        spaceBetween={10}
                        grabCursor={true}
                        breakpoints={{
                            900: {
                                slidesPerView: 2,
                                spaceBetween: 20,
                            },
                            1200: {
                                slidesPerView: 3,
                                spaceBetween: 20,
                            },
                        }}
                    >
                        {PROJECTS.map((p) => (
                            <SwiperSlide key={p.id}>
                                <article className="work-card">
                                    <div className="work-card-img-wrap">
                                        <img
                                            src={p.img}
                                            alt={p.title}
                                            className="work-card-img"
                                            loading="lazy"
                                        />
                                    </div>

                                    <div className="work-card-body">
                                        <div className="work-card-meta">
                                            <h3 className="work-card-title">{p.title}</h3>
                                            <p className="work-card-subtitle">{p.subtitle}</p>
                                        </div>

                                        <div className="work-card-actions">
                                            <a
                                                href={p.href}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="work-card-btn"
                                            >
                                                View Project
                                            </a>
                                        </div>
                                    </div>
                                </article>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* scroll bar under the cards */}
                    <div className="work-swiper-scrollbar" />

                    {/* Mobile drag hint */}
                    <div className="work-scroll-hint">
                        <span>Drag</span>
                        <span className="work-scroll-arrow">→</span>
                    </div>
                </div>
            </section>
       </section>
    );
}