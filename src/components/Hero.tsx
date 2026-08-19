"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";

export default function Hero({ avatarUrl }: { avatarUrl?: string }) {
  return (
    <section
      className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden"
      id="home"
    >
      {/* Subtle background grid/glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 w-full flex justify-between items-center not-lg:flex-col-reverse gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl w-lg font-bold leading-normal text-textPrimary">
              Mada Putra Adhadriyanto
            </h1>
            <h2 className="text-xl md:text-2xl text-primary font-medium">
              Agentic AI Developer · Web Developer · Informatics Student
            </h2>
          </div>

          <p className="text-lg text-textSecondary max-w-xl leading-relaxed">
            Building practical software, AI-powered applications, developer
            tools, and modern web experiences.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a
              href="#projects"
              className="inline-flex items-center justify-center space-x-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-md font-medium transition-colors"
            >
              <span>View Projects</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="https://github.com/Mazees"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 bg-surface hover:bg-border border border-border text-textPrimary px-6 py-3 rounded-md font-medium transition-colors"
            >
              <FaGithub className="w-4 h-4" />
              <span>GitHub Profile</span>
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center md:justify-end relative"
        >
          {avatarUrl ? (
            <div className="relative size-92">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
              <img
                src={avatarUrl}
                alt="Mada Putra Adhadriyanto"
                className="relative z-10 w-full h-full object-cover rounded-full border-2 border-border p-2 bg-surface"
              />
            </div>
          ) : (
            <div className="size-92 rounded-full border-2 border-border p-2 bg-surface flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-border animate-pulse"></div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
