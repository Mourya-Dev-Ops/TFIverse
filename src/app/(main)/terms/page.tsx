import { Metadata } from "next";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Terms of Service — TFIverse",
  description: "Read the TFIverse terms of service and user agreements.",
};

export default function TermsPage() {
  const lastUpdated = "May 7, 2026";

  return (
    <>
      <main className="min-h-[100dvh] bg-black pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-6">
          
          <header className="py-16 md:py-24 border-b border-white/[0.06]">
            <p className="text-white/30 text-[11px] uppercase tracking-[0.2em] font-semibold mb-4">
              Legal
            </p>
            <h1 className="text-[36px] md:text-[48px] font-extrabold text-white tracking-[-0.03em] leading-tight mb-6">
              Terms of Service
            </h1>
            <p className="text-white/40 text-[13px] font-medium">
              Last updated: {lastUpdated}
            </p>
          </header>

          <article className="py-16 space-y-12">
            {[
              {
                title: "1. Acceptance of Terms",
                content: `By accessing or using TFIverse (the "Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.`,
              },
              {
                title: "2. User Accounts",
                content: `When you create an account with us, you must provide information that is accurate, complete, and current. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.

• You are responsible for safeguarding your password.
• You must not disclose your password to any third party.
• You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.`,
              },
              {
                title: "3. User Content & Conduct",
                content: `TFIverse allows users to post memes, create tier lists, and interact with the community. You are solely responsible for the content you post.

You agree **NOT** to post content that:
• Is unlawful, offensive, threatening, libelous, defamatory, or pornographic.
• Promotes hate speech, violence, or discrimination.
• Infringes on any third party's intellectual property rights.
• Contains malicious code, viruses, or spam.

We reserve the right to remove any content and terminate accounts that violate these guidelines without prior notice.`,
              },
              {
                title: "4. Intellectual Property",
                content: `The Service and its original content (excluding User Content), features, and functionality are and will remain the exclusive property of TFIverse and its licensors. 

Images of actors, movie posters, and promotional materials belong to their respective copyright holders and are used on TFIverse under fair use for informational and entertainment purposes.`,
              },
              {
                title: "5. Termination",
                content: `We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.`,
              },
              {
                title: "6. Limitation of Liability",
                content: `In no event shall TFIverse, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.`,
              },
              {
                title: "7. Changes to Terms",
                content: `We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any significant changes. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.`,
              },
              {
                title: "8. Contact Us",
                content: `If you have any questions about these Terms, please contact us at **support@tfiverse.com**.`,
              },
            ].map((section) => (
              <section key={section.title}>
                <h2 className="text-[18px] font-bold text-white tracking-tight mb-4">
                  {section.title}
                </h2>
                <div className="text-white/40 text-[14px] leading-relaxed whitespace-pre-line">
                  {section.content.split("**").map((part, i) =>
                    i % 2 === 1 ? (
                      <strong key={i} className="text-white/80 font-semibold">
                        {part}
                      </strong>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
                </div>
              </section>
            ))}
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}
