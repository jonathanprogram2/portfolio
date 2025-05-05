import React from "react";
import { FaLaptopCode, FaChartBar, FaBriefcase } from "react-icons/fa";

export default function BottomNavBar() {
    return (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-black via-[#090a1f] to-black text-white px-8 py-4 rounded-full shadow-xl flex items-center space-x-6 border border-white/10 backdrop-blur-lg">
            
            {/* Logo Left */}
            <img src="/iconlogo.png" alt="Logo" className="w-8 h-8 mr-2 rounded-full" />

            {/* ABOUT ME */}
            <a href="#about" className="flex items-center space-x-2 text-sm font-ethnocentric hover:text-yellow-400 transition">
                <FaLaptopCode />
                <span>01. ABOUT ME</span>
            </a>

            {/* Separator */}
            <span className="text-white/30">✽</span>

            {/* PROJECTS */}
            <a href="#projects" className="flex items-center space-x-2 text-sm font-ethnocentric hover:text-yellow-400 transition">
                <FaChartBar />
                <span>02. PROJECTS</span>
            </a>
        </div>
    );
}