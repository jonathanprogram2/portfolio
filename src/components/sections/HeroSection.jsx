import { motion, useMotionValue, useTransform } from "framer-motion";
import SuperformulaBackground from "../SuperformulaBackground";
import heroBg from "../../assets/hero-bg.png";
import leftImg from "../../assets/left-screw.png";
import rightImg from "../../assets/right-screw.png";

/**
 * Minimal 2D fallback (purple bg + headline/buttons).
 *  style the headline via the existing CSS (for ex, .headline-gradient)
 */

function FallbackHero({ rX, rY }) {
  return (
    <>
      {/* content */}
      <div className="relative h-full w-full flex items-center justify-center z-20 hero-content">
        <div className="text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              rotateX: rX,
              rotateY: rY,
              transformStyle: "preserve-3d",
              color: "white",
            }}
            className="font-extrabold leading-[0.9] hero-title"
          >
            Designing the
            <br />
            Future
            <br />
            of the Web
          </motion.h1>

          <div
            className="neon-btn neon-left is-cyan cursor-default select-none -translate-y-4 no-neon hero-tiles"
            role="presentation"
          >
            <span aria-hidden />
            <span aria-hidden />
            <span aria-hidden />
            <span aria-hidden />
            <img
              src={leftImg}
              alt=""
              draggable="false"
              className="relative z-[1] h-full w-full object-contain pointer-events-none object-left"
            />
          </div>

          <div
            className="neon-btn neon-right is-magenta cursor-default select-none -translate-y-4 no-neon hero-tiles"
            role="presentation"
          >
            <span aria-hidden />
            <span aria-hidden />
            <span aria-hidden />
            <span aria-hidden />
            <img
              src={rightImg}
              alt=""
              draggable="false"
              className="relative z-[1] h-full w-full object-contain pointer-events-none object-right"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default function HeroSection() {
  // Shared cursor driver (used by both the headline tilt and the 3D scene)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  // Subtle 3D tilt on the headline
  const rX = useTransform(my, [-0.5, 0.5], [4, -4]);
  const rY = useTransform(mx, [-0.5, 0.5], [-4, 4]);

  return (
    <section className="relative h-[100svh] w-full overflow-hidden hero-section">
      {/* Superformula background */}
      <div
        id="scene-container"
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <SuperformulaBackground />

      {/* Fallback / also the visible hero content */}
      <FallbackHero rX={rX} rY={rY} />
    </section>
  );
}
