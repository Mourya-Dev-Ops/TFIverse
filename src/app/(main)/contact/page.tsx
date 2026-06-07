import { Metadata } from "next";
import Footer from "@/components/layout/footer";
import { Mail, MessageSquare, MapPin } from "lucide-react";
import { FaTwitter, FaInstagram } from "react-icons/fa";

export const metadata: Metadata = {
  title: "Contact Us — TFIverse",
  description: "Get in touch with the TFIverse team for support, business inquiries, or general questions.",
};

export default function ContactPage() {
  return (
    <>
      <main className="min-h-[100dvh] bg-black pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          
          <header className="py-16 md:py-24 border-b border-white/[0.06]">
            <p className="text-white/30 text-[11px] uppercase tracking-[0.2em] font-semibold mb-4">
              Get in Touch
            </p>
            <h1 className="text-[36px] md:text-[48px] font-extrabold text-white tracking-[-0.03em] leading-tight mb-6">
              Contact Us
            </h1>
            <p className="text-white/40 text-[15px] leading-relaxed max-w-xl">
              Have a question, feedback, or business inquiry? We're here to help. Reach out to the team behind the ultimate Telugu cinema platform.
            </p>
          </header>

          <div className="py-16 space-y-12">
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Support */}
              <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.03] transition-colors">
                <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-6">
                  <Mail className="w-4 h-4 text-white/60" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Support</h3>
                <p className="text-white/40 text-[13px] leading-relaxed mb-6">
                  Need help with your account or found a bug? Our support team is ready to assist.
                </p>
                <a href="mailto:support@tfiverse.com" className="text-[13px] font-semibold text-white/70 hover:text-white transition-colors">
                  support@tfiverse.com
                </a>
              </div>

              {/* General Inquiries */}
              <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.03] transition-colors">
                <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-6">
                  <MessageSquare className="w-4 h-4 text-white/60" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">General Inquiries</h3>
                <p className="text-white/40 text-[13px] leading-relaxed mb-6">
                  For partnerships, press, or any other general questions about TFIverse.
                </p>
                <a href="mailto:contact@tfiverse.com" className="text-[13px] font-semibold text-white/70 hover:text-white transition-colors">
                  contact@tfiverse.com
                </a>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <h3 className="text-white font-bold text-lg mb-6">Connect with us</h3>
              <div className="flex flex-col sm:flex-row gap-8">
                <a href="https://x.com/TFI_verse" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/40 hover:text-white transition-colors">
                  <FaTwitter className="w-4 h-4" />
                  <span className="text-[13px] font-medium">@TFI_verse</span>
                </a>
                <a href="https://www.instagram.com/tfiverse.in/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-white/40 hover:text-white transition-colors">
                  <FaInstagram className="w-4 h-4" />
                  <span className="text-[13px] font-medium">@tfiverse.in</span>
                </a>
                <div className="flex items-center gap-3 text-white/40">
                  <MapPin className="w-4 h-4" />
                  <span className="text-[13px] font-medium">Hyderabad, India</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
