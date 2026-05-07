import { Metadata } from "next";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "About — TFIverse",
  description:
    "TFIverse is the ultimate cinematic platform celebrating Telugu Film Industry culture. Learn about our mission, team, and vision.",
};

export default function AboutPage() {
  return (
    <>
      <div className="min-h-screen bg-black">
        {/* Hero */}
        <section className="relative pt-32 pb-20 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03)_0%,transparent_60%)]" />
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <p className="text-white/30 text-[10px] tracking-[0.5em] uppercase font-bold mb-4">
              About Us
            </p>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-6 leading-[0.95]">
              The Home of
              <br />
              <span className="bg-gradient-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent">
                Telugu Cinema
              </span>
            </h1>
            <p className="text-white/40 text-lg leading-relaxed max-w-xl mx-auto">
              TFIverse is the premium community platform built to celebrate,
              preserve, and elevate the legacy of the Telugu Film Industry.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16">
            <div>
              <div className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center mb-6">
                <svg
                  className="w-5 h-5 text-white/60"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight mb-4">
                Our Mission
              </h2>
              <p className="text-white/35 text-sm leading-relaxed">
                We believe Telugu cinema deserves a world-class platform — one that
                goes beyond box office numbers. TFIverse is built to be the
                definitive digital home for everything TFI: from the legendary icons
                who shaped the industry to the rising stars redefining it.
              </p>
            </div>

            <div>
              <div className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center mb-6">
                <svg
                  className="w-5 h-5 text-white/60"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight mb-4">
                Community First
              </h2>
              <p className="text-white/35 text-sm leading-relaxed">
                TFIverse is powered by its community. From creating memes and tier
                lists to ranking movies and discovering new talent — every feature
                is designed to let fans express their love for TFI in meaningful
                ways.
              </p>
            </div>
          </div>
        </section>

        {/* What We Offer */}
        <section className="py-20 px-6 border-t border-white/[0.04]">
          <div className="max-w-4xl mx-auto">
            <p className="text-white/30 text-[10px] tracking-[0.5em] uppercase font-bold mb-4 text-center">
              Platform
            </p>
            <h2 className="text-3xl font-black text-white tracking-tight mb-16 text-center">
              What We Offer
            </h2>

            <div className="grid sm:grid-cols-2 gap-8">
              {[
                {
                  title: "Icons Database",
                  desc: "A comprehensive, curated database of every major icon in TFI — Heroes, Heroines, Directors, Music Directors, and 15+ more categories.",
                },
                {
                  title: "Community Memes",
                  desc: "Create, share, and enjoy Telugu cinema memes in a dedicated, community-driven space built for fans.",
                },
                {
                  title: "Tier Lists",
                  desc: "Rank your favorite actors, movies, and directors with our interactive drag-and-drop tier list creator.",
                },
                {
                  title: "User Profiles",
                  desc: "Build your cinematic identity with personalized profiles, favorites, and community contributions.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all group"
                >
                  <h3 className="text-white font-bold text-sm mb-2 group-hover:text-white/90 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-white/30 text-xs leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20 px-6 border-t border-white/[0.04]">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-black text-white tracking-tight mb-4">
              Want to Get Involved?
            </h2>
            <p className="text-white/35 text-sm mb-8 leading-relaxed">
              Whether you&apos;re a creator, a developer, or just a passionate TFI
              fan — we&apos;d love to hear from you.
            </p>
            <a
              href="mailto:contact@tfiverse.com"
              className="inline-block bg-white text-black font-black py-3.5 px-10 rounded-2xl hover:bg-white/90 active:scale-[0.97] transition-all tracking-[0.2em] uppercase text-[10px]"
            >
              Contact Us
            </a>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
