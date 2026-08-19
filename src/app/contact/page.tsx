import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { Mail, Clock, MapPin, ArrowUpRight } from "lucide-react";
import { FaGithub, FaInstagram, FaWhatsapp, FaTelegramPlane } from "react-icons/fa";

export const metadata: Metadata = {
  title: "Contact — Mada Putra Adhadriyanto",
  description:
    "Get in touch with Mada Putra Adhadriyanto (@Mazees) for software development, agentic AI systems, or collaboration inquiries via Email, WhatsApp, or Telegram.",
};

export default function ContactPage() {
  const directChannels = [
    {
      label: "WhatsApp Direct",
      value: "+62 812-3448-9008",
      href: "https://wa.me/6281234489008",
      icon: FaWhatsapp,
    },
    {
      label: "Email Inbox",
      value: "madaadha21@gmail.com",
      href: "mailto:madaadha21@gmail.com",
      icon: Mail,
    },
    {
      label: "Telegram",
      value: "@mazeesid",
      href: "https://t.me/mazeesid",
      icon: FaTelegramPlane,
    },
    {
      label: "GitHub Profile",
      value: "github.com/Mazees",
      href: "https://github.com/Mazees",
      icon: FaGithub,
    },
    {
      label: "Instagram",
      value: "@madaputra21",
      href: "https://instagram.com/madaputra21",
      icon: FaInstagram,
    },
  ];

  return (
    <main className="min-h-screen bg-background font-sans text-textPrimary selection:bg-primary/30 selection:text-primary-light flex flex-col justify-between">
      <Navbar />

      <section className="pt-36 sm:pt-40 pb-24 px-6 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="mb-12" data-aos="fade-up">
          <span className="text-xs font-mono font-bold text-primary tracking-widest uppercase block mb-3">
            // Connect & Collaborate
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-textPrimary tracking-tight mb-4">
            Let&apos;s Build Together
          </h1>
          <p className="text-base sm:text-lg text-textSecondary max-w-2xl font-normal leading-relaxed">
            Have an idea for a web platform, autonomous agent workflow, or looking to discuss engineering opportunities? Fill out the form or reach out directly.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Main Column: Interactive Contact Form */}
          <div className="lg:col-span-7" data-aos="fade-up" data-aos-delay="100">
            <ContactForm />
          </div>

          {/* Side Column: Direct Contacts & Status */}
          <div className="lg:col-span-5 space-y-6" data-aos="fade-up" data-aos-delay="150">
            {/* Quick Channel Links */}
            <div className="bg-surface border border-border rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-bold text-textPrimary font-mono uppercase tracking-wider">
                My Contact
              </h2>
              <div className="space-y-2">
                {directChannels.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl bg-background/50 hover:bg-background border border-border/80 hover:border-primary/40 transition-all group"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-textSecondary group-hover:text-primary transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs text-textSecondary block">
                            {item.label}
                          </span>
                          <span className="text-xs font-semibold text-textPrimary font-mono">
                            {item.value}
                          </span>
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-textSecondary group-hover:text-primary transition-colors" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
