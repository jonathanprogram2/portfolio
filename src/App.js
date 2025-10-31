import React from "react";
import ReactFullpage from "@fullpage/react-fullpage";
import TopNav from "./components/TopNavBar";
import HeroSection from "./components/sections/HeroSection";
import AboutSection from "./components/sections/AboutSection";
import WorkSection from "./components/sections/WorkSection";
import ServicesSection from "./components/sections/ServicesSection";
import ContactSection from "./components/sections/ContactSection";
import FooterSection from "./components/sections/FooterSection";
import "./App.css";

const ANCHORS = ["home", "about", "work", "services", "contact", "footer"];

export default function App() {
  return (
    <>
      {/* Sticky top nav that ties into fullPage via the #menu id */}
      <TopNav anchors={ANCHORS} />

      <ReactFullpage
        licenseKey={"OPEN-SOURCE-GPLV3-LICENSE"}
        anchors={ANCHORS}
        navigation={false}
        scrollBar={true}
        autoScrolling={false}
        navigationPosition="right"
        scrollingSpeed={900}
        fitToSection={false}
        responsiveWidth={1024}
        responsiveHeight={600}
        scrollOverflow={false}
        controlArrows={false}
        slidesNavigation={false}
        menu="#menu"
        // Good defaults for mobile
        normalScrollElements={".allow-scroll"}
        render={() => {
          return (
            <ReactFullpage.Wrapper>
              {/* SECTION 1 — HERO */}
              <div className="section">
                <HeroSection />
              </div>

              {/* SECTION 2 — ABOUT */}
              <div className="section">
                <AboutSection />
              </div>

              {/* SECTION 3 — WORK with HORIZONTAL SLIDES */}
              <div className="section">
                <WorkSection />
              </div>

              {/* SECTION 4 — SERVICES with HORIZONTAL SLIDES */}
              <div className="section">
                <ServicesSection />
              </div>

              {/* SECTION 5 — CONTACT */}
              <div className="section">
                <ContactSection />
              </div>

              {/* SECTION 6 — FOOTER */}
              <div className="section">
                <FooterSection />
              </div>
            </ReactFullpage.Wrapper>
          );
        }}
      />
    </>
  );
}    