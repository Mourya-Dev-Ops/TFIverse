import { Metadata } from "next";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "About Us — TFIverse",
  description: "Learn about TFIverse, the definitive platform for Telugu cinema.",
};

export default function AboutPage() {
  return (
    <>
      <main className="min-h-[100dvh] bg-black pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          
          <header className="py-16 md:py-24 border-b border-white/[0.06]">
            <p className="text-white/30 text-[11px] uppercase tracking-[0.2em] font-semibold mb-4">
              About Us
            </p>
            <h1 className="text-[36px] md:text-[48px] font-extrabold text-white tracking-[-0.03em] leading-tight mb-6">
              For the love of Telugu cinema.
            </h1>
            <p className="text-white/40 text-[15px] leading-relaxed max-w-xl">
              TFIverse is the definitive platform for the Tollywood community. Built by fans, for fans, to celebrate the culture, the heroes, and the magic of the silver screen.
            </p>
          </header>

          <article className="py-16 prose prose-invert prose-p:text-white/40 prose-p:text-[14px] prose-p:leading-relaxed prose-headings:text-white prose-headings:font-bold prose-headings:tracking-tight prose-a:text-white/80 max-w-none">
            <h2 className="text-[20px] mb-4">Our Mission</h2>
            <p className="mb-8">
              For decades, Telugu cinema has been more than just entertainment—it's an emotion, a festival, and a way of life. However, there has never been a unified, premium digital home that truly respects and organizes this rich culture. TFIverse was created to change that.
            </p>

            <h2 className="text-[20px] mb-4 mt-12">What We Do</h2>
            <p className="mb-8">
              We curate the ultimate database of heroes, movies, and box-office records, while providing a platform for the community to share memes, create tier lists, and track upcoming releases. We believe in high-quality design, accurate information, and a seamless user experience.
            </p>

            <h2 className="text-[20px] mb-4 mt-12">The Tech</h2>
            <p className="mb-8">
              TFIverse is built using modern, bleeding-edge web technologies to ensure a fast, responsive, and secure experience. From our database to our frontend architecture, every component is optimized for performance.
            </p>

            <div className="mt-16 p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center">
              <h3 className="text-[16px] font-bold text-white mb-2">Join the Community</h3>
              <p className="text-[13px] text-white/40 mb-6">Sign up today to start logging movies and creating tier lists.</p>
              <a href="/register" className="inline-block px-6 py-2.5 bg-white text-black text-[13px] font-semibold rounded-full hover:bg-white/90 transition-colors">
                Create an account
              </a>
            </div>
          </article>

        </div>
      </main>
      <Footer />
    </>
  );
}
