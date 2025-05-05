import React from "react";
import { Button } from "./button";

export default function Modal({ src, type, onClose }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="relative max-w-5xl w-full mx-4">
                <button
                  onClick={onClose}
                  className="absolute top-2 right-2 text-white bg-black bg-opacity-30 hover:bg-opacity-60 p-2 rounded-full text-xl font-bold"
                >
                  ✕
                </button>

                {type === "image" ? (
                    <img
                        src={src}
                        alt="Expanded media"
                        className="w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
                    />    
                ) : (
                  <video
                    src={src}
                    controls
                    autoPlay
                    className="w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
                   />   
                )}    
            </div>
        </div>
    );
}