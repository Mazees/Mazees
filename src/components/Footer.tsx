import { FaGithub, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="py-8 border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <p className="text-textSecondary text-sm">
            © {new Date().getFullYear()} Mada Putra Adhadriyanto
          </p>
          <p className="text-textSecondary text-xs mt-1">
            Built with passion and lots of code.
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <a
            href="https://github.com/Mazees"
            target="_blank"
            rel="noopener noreferrer"
            className="text-textSecondary hover:text-primary transition-colors"
          >
            <FaGithub className="w-5 h-5" />
          </a>
          <a
            href="https://instagram.com/mada.putraa"
            target="_blank"
            rel="noopener noreferrer"
            className="text-textSecondary hover:text-primary transition-colors"
          >
            <FaInstagram className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
