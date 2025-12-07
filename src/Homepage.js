import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import GlitchImage from "./GlitchImage";

gsap.registerPlugin(ScrollTrigger);

const Homepage = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const heroTextRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Animation
      const tl = gsap.timeline();
      tl.from(".hero-char", {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.05,
        ease: "power4.out",
      });

      // Scroll Animations
      gsap.utils.toArray(".reveal-text").forEach((text) => {
        gsap.fromTo(
          text,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            scrollTrigger: {
              trigger: text,
              start: "top 80%",
              end: "bottom 20%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleMouseEnter = (e) => {
    const target = e.currentTarget;
    gsap.to(target, { scale: 0.98, duration: 0.3 });
    // Removed GSAP image tween to let GlitchImage handle it
    gsap.to(target.querySelector(".glitch-text"), {
      x: 5,
      color: "#ff003c",
      duration: 0.1,
      yoyo: true,
      repeat: 3,
    });
  };

  const handleMouseLeave = (e) => {
    const target = e.currentTarget;
    gsap.to(target, { scale: 1, duration: 0.3 });
    // Removed GSAP image tween
    gsap.to(target.querySelector(".glitch-text"), {
      x: 0,
      color: "#ffffff",
      duration: 0.1,
    });
  };

  return (
    <div ref={containerRef} className="w-full min-h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Hero Section */}
      <section className="h-screen flex flex-col justify-center items-center relative z-10">
        <div className="absolute inset-0 z-[-1] opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-[128px] animate-blob animation-delay-4000"></div>
        </div>

        <h1 className="text-[12vw] font-black leading-none tracking-tighter text-center uppercase mix-blend-difference" ref={heroTextRef}>
          {Array.from("PORTFOLIO").map((char, index) => (
            <span key={index} className="hero-char inline-block">
              {char}
            </span>
          ))}
        </h1>
        <p className="mt-8 text-xl md:text-2xl font-light tracking-[0.5em] text-gray-400 reveal-text">
          CREATIVE DEVELOPER & DESIGNER
        </p>
        <div className="absolute bottom-10 animate-bounce">
          <span className="text-xs tracking-widest">SCROLL TO EXPLORE</span>
        </div>
      </section>

      {/* Portfolio Selection */}
      <section className="min-h-screen flex flex-col md:flex-row w-full">
        {/* UX Design */}
        <div
          className="w-full md:w-1/2 h-[50vh] md:h-screen relative border-r border-[#ffffff10] group cursor-pointer overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => window.open("https://behance.net/abhiroopchaudhuri", "_blank")}
        >
          <div className="absolute inset-0 z-0">
            <GlitchImage
              src={`${process.env.PUBLIC_URL}/ux-block.webp`}
              alt="UX Design"
              className="w-full h-full"
            />
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-all duration-500 z-40 pointer-events-none" />
          </div>
          <div className="relative z-50 h-full flex flex-col justify-center items-center p-10 pointer-events-none">
            <h2 className="glitch-text text-6xl md:text-8xl font-bold tracking-tighter mb-4">UX/UI</h2>
            <p className="text-sm tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
              VIEW PROJECTS
            </p>
          </div>
        </div>

        {/* Frontend Dev */}
        <div
          className="w-full md:w-1/2 h-[50vh] md:h-screen relative border-l border-[#ffffff10] group cursor-pointer overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => navigate("/frontend-projects")}
        >
          <div className="absolute inset-0 z-0">
            <GlitchImage
              src={`${process.env.PUBLIC_URL}/ai-block.webp`}
              alt="Frontend"
              className="w-full h-full"
            />
            <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-all duration-500 z-40 pointer-events-none" />
          </div>
          <div className="relative z-50 h-full flex flex-col justify-center items-center p-10 pointer-events-none">
            <h2 className="glitch-text text-6xl md:text-8xl font-bold tracking-tighter mb-4">DEV</h2>
            <p className="text-sm tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
              VIEW PROJECTS
            </p>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="py-32 px-4 md:px-20 border-t border-[#ffffff10]">
        <h3 className="text-4xl md:text-6xl font-bold mb-20 tracking-tighter reveal-text">CERTIFICATIONS</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { img: "ai_certification.webp", link: "https://coursera.org/share/9cbf601beeac9fb2e831d4170f52ad28", title: "AI For Everyone" },
            { img: "ux_certification.webp", link: "https://coursera.org/share/bf77019fdf390d8c3f01c2bb8851b54c", title: "Google UX Design" },
            { img: "product_certification.webp", link: "https://coursera.org/share/0d5737a8389a205da01d8cc92028ad18", title: "Product Management" },
            { img: "frontend_certification.webp", link: "https://coursera.org/share/4baf63692cc1ea833e1471dccda3f11e", title: "Meta Frontend Dev" },
          ].map((cert, index) => (
            <a
              key={index}
              href={cert.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group block reveal-text"
            >
              <div className="relative overflow-hidden rounded-lg mb-4">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-end p-6">
                  <span className="text-sm font-bold tracking-widest text-white">VERIFY</span>
                </div>
                <img
                  src={`${process.env.PUBLIC_URL}/${cert.img}`}
                  alt={cert.title}
                  className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-500 filter grayscale group-hover:grayscale-0"
                />
              </div>
              <h4 className="text-xl font-medium group-hover:text-[var(--accent-color)] transition-colors">{cert.title}</h4>
            </a>
          ))}
        </div>
      </section>

      {/* Footer-like simple text */}
      <div className="py-10 text-center text-gray-600 text-sm">
        &copy; 2025 ABHIROOP CHAUDHURI. MADE WITH REACT, GSAP & LENIS.
      </div>
    </div>
  );
};

export default Homepage;
