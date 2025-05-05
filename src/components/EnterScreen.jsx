import React, { useEffect, useState, useRef } from "react";

export default function EnterScreen({ onEnter }) {
    const [hover, setHover] = useState(false);
    const [mouse, setMouse] = useState({ x: 0, y: 0 });
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const cursorRef = useRef(null);

    
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMouse({ x: e.clientX, y: e.clientY });
        }
        window.addEventListener("mousemove", handleMouseMove);
        
        let frameId;

        const follow = () => {
            setPos((prev) => {
                const dx = mouse.x - prev.x;
                const dy = mouse.y - prev.y;
                return {
                    x: prev.x + dx * 0.05,
                    y: prev.y + dy * 0.05,
                };
            });
            frameId = requestAnimationFrame(follow);
        };

        follow();

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(frameId);
        };
    }, [mouse]);

    return (
        <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
            {/* Cursor ring */}
            <div
                ref={cursorRef}
                className="pointer-events-none fixed z-[99999] transition-transform duration-75 ease-out"
                style={{
                    left: pos.x - 24,
                    top: pos.y - 24,
                    width: 48,
                    height: 48,
                }}
            >
                <div className="w-full h-full border border-white rounded-full opacity-60" />
                <div className="w-1.5 h-1.5 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />  
            </div>    

            {/* Enter Button */}
            <button
                onClick={onEnter}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                className="font-ethnocentric border border-white text-white px-10 py-4 text-lg tracking-widest rounded-md hover:scale-110 hover:bg-white hover:text-black transition-all duration-300"
            >
                {hover ? ">>>>>" : "ENTER"}
            </button>    
        </div>    
    );
}