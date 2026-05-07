import { Metadata } from "next";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Terms of Service — TFIverse",
  description:
    "Review the TFIverse terms of service. Understand the rules, guidelines, and agreements for using our platform.",
};

export default function TermsPage() {
  const lastUpdated = "May 7, 2026";

  return (
    <>
      <div className="min-h-screen bg-black">
        {/* Hero */}
        <section className="relative pt-32 pb-16 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03)_0%,transparent_60%)]" />
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <p className="text-white/30 text-[10px] tracking-[0.5em] uppercase font-bold mb-4">
              Legal
            </p>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter mb-6">
              Terms of Service
            </h1>
            <p className="text-white/30 text-sm">
              Last updated: {lastUpdated}
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto space-y-12">
            {[
              {
                title: "1. Acceptance of Terms",
                content: `By accessing or using TFIverse ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform.

TFIverse is operated by TFIverse ("we", "us", "our"). The Platform is a community-driven cinematic database focused on the Telugu Film Industry.`,
              },
              {
                title: "2. Eligibility",
                content: `You must be at least 13 years of age to use TFIverse. By using the Platform, you represent that you meet this age requirement. If you are under 18, you confirm that you have the consent of a parent or legal guardian.`,
              },
              {
                title: "3. Account Registration",
                content: `To access certain features, you must create an account. You agree to:

• Provide accurate and complete registration information.
• Maintain the security of your account credentials.
• Notify us immediately of any unauthorized access to your account.
• Accept responsibility for all activities that occur under your account.

We reserve the right to suspend or terminate accounts that violate these terms.`,
              },
              {
                title: "4. Acceptable Use",
                content: `When using TFIverse, you agree NOT to:

• Upload or share content that is illegal, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable.
• Impersonate any person or entity, or misrepresent your affiliation with any person or entity.
• Upload content that infringes on any third party's intellectual property rights.
• Attempt to gain unauthorized access to any part of the Platform.
• Use automated scripts, bots, or scrapers to access the Platform.
• Spam, advertise, or promote unrelated products or services.
• Upload malicious code, viruses, or any harmful software.

Violation of these rules may result in immediate account suspension.`,
              },
              {
                title: "5. User-Generated Content",
                content: `TFIverse allows users to create and share content including memes, tier lists, reviews, and profile information ("User Content"). By submitting User Content, you:

• Retain ownership of your original content.
• Grant TFIverse a non-exclusive, worldwide, royalty-free license to display, distribute, and promote your content within the Platform.
• Confirm that your content does not violate any third party's rights.
• Understand that we may remove content that violates these terms at our sole discretion.`,
              },
              {
                title: "6. Intellectual Property",
                content: `The TFIverse platform, including its design, code, branding, and original content, is protected by intellectual property laws. You may not copy, modify, distribute, or reverse-engineer any part of the Platform without our explicit written consent.

Celebrity images, movie posters, and related media are used under fair use for informational and commentary purposes. All trademarks belong to their respective owners.`,
              },
              {
                title: "7. Privacy",
                content: `Your privacy is important to us. Our use of your personal information is governed by our Privacy Policy. By using TFIverse, you consent to the practices described in our Privacy Policy.`,
              },
              {
                title: "8. Service Availability",
                content: `We strive to keep TFIverse available 24/7, but we do not guarantee uninterrupted access. We reserve the right to:

• Modify, suspend, or discontinue any feature at any time.
• Perform maintenance that may temporarily affect availability.
• Limit access during periods of high demand or security concerns.

We will make reasonable efforts to notify users of significant planned downtime.`,
              },
              {
                title: "9. Limitation of Liability",
                content: `TFIverse is provided "as is" without warranties of any kind, either express or implied. We are not liable for:

• Any loss of data, revenue, or profits arising from your use of the Platform.
• Any damages resulting from unauthorized access to your account.
• Any content posted by other users.
• Any interruptions or errors in the service.

Our total liability shall not exceed the amount paid by you (if any) in the 12 months preceding the claim.`,
              },
              {
                title: "10. Modifications to Terms",
                content: `We reserve the right to update these Terms of Service at any time. We will notify you of material changes via email or a prominent notice on the Platform. Your continued use of TFIverse after changes are posted constitutes acceptance of the updated terms.`,
              },
              {
                title: "11. Governing Law",
                content: `These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts located in India.`,
              },
              {
                title: "12. Contact",
                content: `If you have any questions about these Terms of Service, please contact us:

• Email: admin@tfiverse.com
• Support: support@tfiverse.com`,
              },
            ].map((section) => (
              <div key={section.title}>
                <h2 className="text-xl font-black text-white tracking-tight mb-4">
                  {section.title}
                </h2>
                <p className="text-white/35 text-sm leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
