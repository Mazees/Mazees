import { FaGithub, FaInstagram, FaWhatsapp, FaTelegramPlane } from "react-icons/fa";
import { Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-8 border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <p className="text-textSecondary text-sm font-medium">
            © {new Date().getFullYear()} Mada Putra Adhadriyanto (@Mazees)
          </p>
          <p className="text-textSecondary text-xs mt-1 font-mono">
            // Full-Stack & Agentic AI Systems
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <a
            href="https://wa.me/6281234489008"
            target="_blank"
            rel="noopener noreferrer"
            className="text-textSecondary hover:text-primary transition-colors"
            title="WhatsApp"
          >
            <FaWhatsapp className="w-5 h-5" />
          </a>
          <a
            href="https://t.me/mazeesid"
            target="_blank"
            rel="noopener noreferrer"
            className="text-textSecondary hover:text-primary transition-colors"
            title="Telegram"
          >
            <FaTelegramPlane className="w-5 h-5" />
          </a>
          <a
            href="mailto:madaadha21@gmail.com"
            className="text-textSecondary hover:text-primary transition-colors"
            title="Email"
          >
            <Mail className="w-5 h-5" />
          </a>
          <a
            href="https://github.com/Mazees"
            target="_blank"
            rel="noopener noreferrer"
            className="text-textSecondary hover:text-primary transition-colors"
            title="GitHub"
          >
            <FaGithub className="w-5 h-5" />
          </a>
          <a
            href="https://instagram.com/madaputra21"
            target="_blank"
            rel="noopener noreferrer"
            className="text-textSecondary hover:text-primary transition-colors"
            title="Instagram"
          >
            <FaInstagram className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
