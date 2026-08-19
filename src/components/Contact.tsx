import Link from "next/link";
import { ArrowRight, Send, Mail } from "lucide-react";
import { FaWhatsapp, FaTelegramPlane } from "react-icons/fa";

export default function Contact() {
  return (
    <section
      className="pb-24 pt-28 border-t border-border bg-surface/30"
      id="contact"
    >
      <div className="max-w-4xl mx-auto px-6 text-center" data-aos="fade-up">
        <span className="text-xs font-mono font-bold text-primary tracking-widest uppercase block mb-3">
          // 06 · Connect & Collaborate
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-textPrimary tracking-tight mb-4">
          Let&apos;s Build Something Together
        </h2>
        <p className="text-base sm:text-lg text-textSecondary mb-8 max-w-xl mx-auto font-normal">
          Have an idea, a project, or looking to discuss engineering opportunities? Drop a message via Email, WhatsApp, or Telegram.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4" data-aos="fade-up" data-aos-delay="100">
          <Link
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-primary hover:bg-primary-dark text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-md shadow-primary/20 hover:scale-[1.02] group"
          >
            <Send className="w-4 h-4" />
            <span>Open Contact Form</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
