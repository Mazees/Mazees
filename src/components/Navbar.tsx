"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Bot } from "lucide-react";
import { FaGithub } from "react-icons/fa";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll spy for homepage hash sections
  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection("");
      return;
    }

    const sections = ["about", "skills"];
    const handleScrollSpy = () => {
      const scrollY = window.scrollY;
      if (scrollY < 200) {
        setActiveSection("");
        return;
      }
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop - 140;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(sectionId);
            return;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScrollSpy, { passive: true });
    handleScrollSpy();
    return () => window.removeEventListener("scroll", handleScrollSpy);
  }, [pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleStartTour = () => {
    setMobileMenuOpen(false);
    if (pathname !== "/") {
      router.push("/");
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("start-mark-tour"));
        }
      }, 300);
    } else {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("start-mark-tour"));
      }
    }
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/#about" },
    { name: "Skills", href: "/#skills" },
    { name: "Projects", href: "/projects" },
    { name: "Repositories", href: "/repositories" },
    { name: "Contact", href: "/contact" },
  ];

  const getIsActive = (href: string) => {
    if (pathname === "/") {
      if (href === "/") return activeSection === "";
      if (href === "/#about") return activeSection === "about";
      if (href === "/#skills") return activeSection === "skills";
      return false;
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-1/2 -translate-x-1/2 mt-4 w-[92%] sm:w-[90%] max-w-6xl z-50 transition-all duration-300 ${
          isScrolled || mobileMenuOpen
            ? "border border-white/10 bg-surface/90 backdrop-blur-2xl shadow-2xl shadow-black/40 rounded-2xl sm:rounded-full py-3 sm:py-4"
            : "border border-border/60 bg-surface/50 backdrop-blur-xl rounded-2xl sm:rounded-full py-4"
        }`}
      >
        <div className="px-6 sm:px-8 flex items-center justify-between">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="text-lg sm:text-xl font-extrabold tracking-widest text-textPrimary hover:text-primary transition-colors flex items-center space-x-2"
          >
            <span className="text-primary font-mono">&lt;</span>
            <span>MAZEES</span>
            <span className="text-primary font-mono">/&gt;</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => {
              const isActive = getIsActive(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs font-semibold tracking-wide transition-colors ${
                    isActive
                      ? "text-primary font-bold"
                      : "text-textSecondary hover:text-primary"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            <div className="flex items-center space-x-3 pl-4 border-l border-border/60">
              <button
                type="button"
                onClick={handleStartTour}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-surface hover:bg-border border border-primary/30 text-textPrimary hover:text-primary text-xs font-semibold transition-all hover:scale-[1.02]"
                title="Guided tour with Mark"
              >
                <Bot className="w-3.5 h-3.5 text-primary" />
                <span>Tour</span>
              </button>

              <a
                href="https://github.com/Mazees"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-primary hover:bg-primary-dark px-4 py-2 rounded-full text-xs font-bold text-white transition-all shadow-md shadow-primary/20 hover:scale-[1.03]"
              >
                <FaGithub className="w-4 h-4" />
                <span>GitHub</span>
              </a>
            </div>
          </div>

          {/* Mobile Toggle Button */}
          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="md:hidden p-2 rounded-xl bg-surface/80 border border-border text-textPrimary hover:text-primary transition-colors focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-primary" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Nav Dropdown (Smooth seamless expansion inside floating card) */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 px-6 pb-4 border-t border-border/60 flex flex-col space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => {
              const isActive = getIsActive(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between py-2 px-4 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "text-textSecondary hover:text-textPrimary hover:bg-surface"
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}

            <div className="pt-4 mt-2 border-t border-border/60">
              <a
                href="https://github.com/Mazees"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 bg-primary hover:bg-primary-dark text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-md shadow-primary/20"
              >
                <FaGithub className="w-4 h-4" />
                <span>Visit GitHub Profile</span>
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Backdrop Overlay (Click to dismiss) */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-200"
        />
      )}
    </>
  );
}
