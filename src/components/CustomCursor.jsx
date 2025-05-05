import React, { useEffect, useRef } from "react";

export default function CustomCursor() {
    const ringRef = useRef(null);
    const dotRef = useRef(null);

    const targetPos = useRef({ x: 0, y: 0 });  // where the real mouse is
    const ringPos = useRef({ x: 0, y: 0 }); // where the circle is
    const dotPos = useRef({ x: 0, y: 0 }); // center dot

    useEffect(() => {
        const handleMouseMove = (e) => {
            targetPos.current.x = e.clientX;
            targetPos.current.y = e.clientY;
        };

        window.addEventListener("mousemove", handleMouseMove);

        const animate = () => {
            // Ring motion
            ringPos.current.x += (targetPos.current.x - ringPos.current.x) * 0.08;
            ringPos.current.y += (targetPos.current.y - ringPos.current.y) * 0.08;

            // Dot motion
            dotPos.current.x += (targetPos.current.x - dotPos.current.x) * 0.2;
            dotPos.current.y += (targetPos.current.y - dotPos.current.y) * 0.2;


            if (ringRef.current) {
                ringRef.current.style.transform = `translate3d(${ringPos.current.x - 24}px, ${ringPos.current.y - 24}px, 0)`;
            }
            if (dotRef.current) {
                dotRef.current.style.transform = `translate3d(${dotPos.current.x - 4}px, ${dotPos.current.y - 4}px, 0)`;
            }

            requestAnimationFrame(animate);
        };

        animate(); // Start animation

        return() => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <>
        <div
            ref={ringRef}
            className="pointer-events-none fixed z-[9999] w-12 h-12 border border-white rounded-full opacity-60 transition-transform duration-75"
        />
        <div
            ref={dotRef}
            className="pointer-events-none fixed z-[9999] w-2 h-2 border bg-white rounded-full" 
        />       
       </>
    );
}