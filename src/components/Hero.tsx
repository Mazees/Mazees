"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bot } from "lucide-react";
import { FaGithub } from "react-icons/fa";

export default function Hero({ avatarUrl }: { avatarUrl?: string }) {
  const frontImage = "/profile_1.jpg";
  const backImage = "/profile_2.jpg";

  const handleStartTour = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("start-mark-tour"));
    }
  };

  return (
    <section
      className="relative min-h-screen flex items-center pt-32 sm:pt-36 lg:pt-28 pb-16 overflow-hidden"
      id="home"
    >
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] lg:w-[800px] h-[350px] sm:h-[600px] lg:h-[800px] bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col-reverse lg:flex-row items-center justify-between gap-10 lg:gap-16">
        {/* Left Column: Headline & Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6 sm:space-y-8 max-w-2xl text-center lg:text-left"
        >
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-textPrimary leading-[1.1]">
              Mada Putra Adhadriyanto
            </h1>
            <h2 className="text-lg sm:text-2xl md:text-3xl text-primary font-bold tracking-tight">
              Agentic AI Explorer & Web Developer
            </h2>
          </div>

          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-textSecondary leading-relaxed font-normal max-w-xl mx-auto lg:mx-0">
            Building practical software, AI-powered applications, autonomous
            agent ecosystems, and high-performance web experiences.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <button
              type="button"
              onClick={handleStartTour}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/25 hover:scale-[1.02] group"
            >
              <Bot className="w-4 h-4 text-white group-hover:rotate-12 transition-transform" />
              <span>Tour with Mark</span>
            </button>
            <a
              href="#projects-preview"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-surface hover:bg-border border border-border text-textPrimary px-6 py-3 rounded-xl font-semibold transition-all hover:scale-[1.02]"
            >
              <span>View Projects</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="https://github.com/Mazees"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-surface hover:bg-border border border-border text-textPrimary px-6 py-3 rounded-xl font-semibold transition-all hover:scale-[1.02]"
            >
              <FaGithub className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          </div>
        </motion.div>

        {/* Right Column: 3D Flip Profile Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative group cursor-pointer [perspective:1000px] shrink-0"
        >
          <div className="w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-96 lg:h-96 rounded-3xl relative transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] shadow-2xl">
            {/* Front Side: profile_1.jpg with warm orange filter */}
            <div className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden border-2 border-border group-hover:border-primary/50 [backface-visibility:hidden] bg-surface transition-colors duration-500">
              <img
                src={frontImage}
                alt="Mada Putra Adhadriyanto"
                className="w-full h-full object-cover contrast-105 brightness-95 transition-all duration-500"
              />
            </div>

            {/* Back Side: profile_2.jpg (Flipped 180deg) */}
            <div className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden border-2 border-primary [backface-visibility:hidden] [transform:rotateY(180deg)] bg-surface shadow-2xl shadow-primary/20">
              <img
                src={backImage}
                alt="Mada Putra Adhadriyanto - Alternate"
                className="w-full h-full object-cover contrast-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
