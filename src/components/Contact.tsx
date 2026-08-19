import { Mail } from "lucide-react";
import { FaGithub, FaInstagram } from "react-icons/fa";

export default function Contact() {
  return (
    <section
      className="pb-24 pt-28 border-t border-border bg-surface/50"
      id="contact"
    >
      <div className="max-w-4xl mx-auto px-6 text-center">
        <span className="text-xs font-mono font-bold text-primary tracking-widest uppercase block mb-3">
          // 06 · Connect & Collaborate
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-textPrimary tracking-tight mb-4">
          Let&apos;s Build Something Together
        </h2>
        <p className="text-base sm:text-lg text-textSecondary mb-8 max-w-xl mx-auto font-normal">
          Have an idea, a project, or looking to discuss engineering
          opportunities? Let&apos;s connect.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://github.com/Mazees"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-6 py-3 bg-surface hover:bg-background border border-border hover:border-primary text-textPrimary rounded-full transition-all group"
          >
            <FaGithub className="w-5 h-5 group-hover:text-primary transition-colors" />
            <span>GitHub</span>
          </a>
          <a
            href="https://instagram.com/mada.putraa"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-6 py-3 bg-surface hover:bg-background border border-border hover:border-primary text-textPrimary rounded-full transition-all group"
          >
            <FaInstagram className="w-5 h-5 group-hover:text-primary transition-colors" />
            <span>Instagram</span>
          </a>
          <a
            href="mailto:mada.putra.a@gmail.com"
            className="flex items-center space-x-2 px-6 py-3 bg-surface hover:bg-background border border-border hover:border-primary text-textPrimary rounded-full transition-all group"
          >
            <Mail className="w-5 h-5 group-hover:text-primary transition-colors" />
            <span>Email</span>
          </a>
        </div>
      </div>
    </section>
  );
}
