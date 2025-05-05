import React, { useState } from "react";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";



export default function FixedTopUI({ toggleSound, soundOn }) {
    const [hover, setHover] = useState(false);


    return (
        <div className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-black/0 backdrop-blur-lg border-white/10">
            {/* Logo Left */}
            <div className="flex items-center space-x-3">
                <img src="/iconlogo.png" alt="Logo" className="w-10 h-10" />
            </div>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
                {/* 🔊 Sound Toggle */}
                <button onClick={toggleSound} className="text-white hover:text-yellow-400">
                    {soundOn ? <FaVolumeUp /> : <FaVolumeMute />}
                </button>

                {/* 🖐 Say Hello Button */}
                <a
                    href="mailto:jonathan.a.mirabal@gmail.com"
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    className={`group relative px-5 py-2 rounded-xl border transition-all duration-300 ${
                        hover ? "bg-white text-black border-white" : "bg-black border-white text-white"
                    }`}
                >
                    <span className="block font-ethnocentric text-sm tracking-wider transition-all duration-300 flex items-center gap-2">
                        {hover ? (
                          <>
                            👋
                            <span className="animate-wave">HELLO</span>
                          </>  
                        ) : (
                          "SAY HELLO"
                        )}
                    </span>
                </a>    
            </div>
        </div>
    );
}