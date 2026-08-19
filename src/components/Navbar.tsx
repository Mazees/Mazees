"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { FaGithub } from "react-icons/fa";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/#about" },
    { name: "Projects", href: "/projects" },
    { name: "Repositories", href: "/repositories" },
    { name: "Skills", href: "/#skills" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold tracking-widest text-textPrimary hover:text-primary transition-colors flex items-center space-x-2"
        >
          <span>&lt;MAZEES/&gt;</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href) && !link.href.includes("#");

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-xs font-medium transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-textSecondary hover:text-primary"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="flex items-center space-x-2 pl-3 border-l border-border">
            <a
              href="https://github.com/Mazees"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 bg-primary hover:bg-primary-dark px-3.5 py-1.5 rounded-full text-xs font-medium text-white transition-all shadow-sm"
            >
              <FaGithub className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-textPrimary p-1"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6 text-textPrimary" />
          )}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-surface/95 backdrop-blur-xl border-b border-border flex flex-col p-6 space-y-4 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-textSecondary hover:text-primary transition-colors text-base py-1"
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-4 border-t border-border flex flex-col gap-3">
            <a
              href="https://github.com/Mazees"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 bg-primary text-white py-2.5 rounded-xl text-sm font-medium"
            >
              <FaGithub className="w-4 h-4" />
              <span>GitHub Profile</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
