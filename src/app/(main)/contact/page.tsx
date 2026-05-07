import { Metadata } from "next";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Contact — TFIverse",
  description:
    "Get in touch with the TFIverse team. Reach us via email for support, feedback, partnerships, and inquiries.",
};

export default function ContactPage() {
  return (
    <>
      <div className="min-h-screen bg-black">
        {/* Hero */}
        <section className="relative pt-32 pb-20 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03)_0%,transparent_60%)]" />
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <p className="text-white/30 text-[10px] tracking-[0.5em] uppercase font-bold mb-4">
              Get In Touch
            </p>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-6">
              Contact Us
            </h1>
            <p className="text-white/40 text-lg leading-relaxed max-w-xl mx-auto">
              We&apos;d love to hear from you. Reach out for support, feedback,
              partnership inquiries, or just to say hello.
            </p>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                ),
                label: "General Inquiries",
                value: "contact@tfiverse.com",
                href: "mailto:contact@tfiverse.com",
              },
              {
                icon: (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                ),
                label: "Technical Support",
                value: "support@tfiverse.com",
                href: "mailto:support@tfiverse.com",
              },
              {
                icon: (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                ),
                label: "Business & Partnerships",
                value: "admin@tfiverse.com",
                href: "mailto:admin@tfiverse.com",
              },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.15] transition-all group text-center flex flex-col items-center"
              >
                <div className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center mb-5 text-white/40 group-hover:text-white/70 group-hover:border-white/20 transition-all">
                  {item.icon}
                </div>
                <h3 className="text-white/60 font-bold text-xs uppercase tracking-widest mb-2">
                  {item.label}
                </h3>
                <p className="text-white font-semibold text-sm group-hover:underline underline-offset-4 decoration-white/20">
                  {item.value}
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* FAQ / Additional Info */}
        <section className="py-20 px-6 border-t border-white/[0.04]">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-black text-white tracking-tight mb-12 text-center">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              {[
                {
                  q: "How do I create an account?",
                  a: "Visit tfiverse.com and click 'Create Account'. You can sign up with your email or use Google for instant access.",
                },
                {
                  q: "Is TFIverse free to use?",
                  a: "Yes! TFIverse is completely free. We believe every TFI fan deserves access to a premium cinematic platform.",
                },
                {
                  q: "How can I report inappropriate content?",
                  a: "If you encounter any content that violates our community guidelines, please report it through the platform or email us at support@tfiverse.com.",
                },
                {
                  q: "Can I request a feature?",
                  a: "Absolutely! We love hearing from our community. Send your feature requests to contact@tfiverse.com and we'll consider them for future updates.",
                },
                {
                  q: "How do I delete my account?",
                  a: "You can request account deletion by emailing admin@tfiverse.com. We will process your request and remove your data within 30 days.",
                },
              ].map((faq) => (
                <div
                  key={faq.q}
                  className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
                >
                  <h3 className="text-white font-bold text-sm mb-2">{faq.q}</h3>
                  <p className="text-white/35 text-xs leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Links */}
        <section className="py-16 px-6 border-t border-white/[0.04]">
          <div className="max-w-xl mx-auto text-center">
            <p className="text-white/30 text-[10px] tracking-[0.5em] uppercase font-bold mb-4">
              Follow Us
            </p>
            <h2 className="text-xl font-black text-white tracking-tight mb-8">
              Stay Connected
            </h2>
            <div className="flex items-center justify-center gap-4">
              {[
                { label: "Twitter", href: "https://twitter.com/TFI_verse" },
                { label: "Instagram", href: "#" },
                { label: "YouTube", href: "#" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20 transition-all text-xs font-bold tracking-widest uppercase"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
