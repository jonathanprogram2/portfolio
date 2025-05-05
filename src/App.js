import { useState, useEffect, useRef, Suspense } from "react";
import EnterScreen from "./components/EnterScreen";
import HeroSection from "./components/HeroSection";
import AboutSection from "./components/AboutSection";
import AnimatedBotSection from "./components/AnimatedBotSection";
import ProjectsSection from "./components/ProjectsSection";
import BottomNavBar from "./components/BottomNavBar";
import FixedTopUI from "./components/FixedTopUI";
import soundFile from "./assets/uimusic.mp3";
import CustomCursor from "./components/CustomCursor";
import Spline from "@splinetool/react-spline";


export default function App() {
  const [entered, setEntered] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const audioRef = useRef(null); 

  useEffect(() => {
    if (entered) {
      if (!audioRef.current) {
        audioRef.current = new Audio(soundFile);
        audioRef.current.loop = true;
        audioRef.current.volume = 0.6;

      }
      
      if (soundOn) {
        audioRef.current.play(). catch((err) => {
          console.log("Autoplay failed:", err);

      });
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }
  }, [entered, soundOn]);

  useEffect(() => {
    if (entered) {
      document.body.classList.add("entered-mode");
    } else {
      document.body.classList.remove("entered-mode");
    }
  }, [entered]);

  return (
    <>
      {!entered && <EnterScreen onEnter={() => setEntered(true)} />} 
      {entered && (
          <div className="relative font-sans text-white bg-transparent overflow-x-hidden scroll-smooth">
            <Suspense fallback={null}>
              <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
                <Spline scene="https://prod.spline.design/LY2jkTzWSL294mW9/scene.splinecode" className="w-full h-full" />
              </div>
            </Suspense>

            <CustomCursor />
            <FixedTopUI  
              soundOn={soundOn}
              toggleSound={() => setSoundOn((prev) => !prev)} />
            <HeroSection entered={entered} />
            <AboutSection />
            <ProjectsSection />
            <BottomNavBar />  
          </div>
      )}
    </>
  );
}    