import { Mail } from "lucide-react";
import { FaGithub, FaInstagram } from "react-icons/fa";

export default function Contact() {
  return (
    <section className="py-24 border-t border-border bg-surface/50" id="contact">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-textPrimary mb-6">Let's Build Something</h2>
        <p className="text-xl text-textSecondary mb-10 max-w-2xl mx-auto">
          Have an idea, project, or something interesting to build? Let's connect.
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
