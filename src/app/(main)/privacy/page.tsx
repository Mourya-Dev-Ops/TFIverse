import { Metadata } from "next";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Privacy Policy — TFIverse",
  description:
    "Read the TFIverse privacy policy. Learn how we collect, use, and protect your personal data.",
};

export default function PrivacyPage() {
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
              Privacy Policy
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
                title: "1. Information We Collect",
                content: `When you create an account on TFIverse, we collect the following information:

• **Account Information:** Your name, email address, and password (stored securely with bcrypt hashing).
• **Profile Information:** Any information you voluntarily add to your profile, including display name, bio, and avatar image.
• **Usage Data:** We collect anonymized usage data such as pages visited, features used, and interaction patterns to improve our platform.
• **Cookies:** We use essential session cookies for authentication. We do not use third-party advertising cookies.`,
              },
              {
                title: "2. How We Use Your Information",
                content: `We use the information we collect to:

• Provide, maintain, and improve the TFIverse platform.
• Send transactional emails including account verification, password resets, and important service updates.
• Personalize your experience and show relevant content.
• Detect and prevent fraud, abuse, and security incidents.
• Communicate with you about new features or changes to our terms.

We will **never** sell your personal data to third parties.`,
              },
              {
                title: "3. Data Storage & Security",
                content: `Your data is stored securely on cloud infrastructure managed by Supabase (PostgreSQL database) and Vercel (application hosting). We implement industry-standard security measures including:

• Encrypted data transmission (TLS/SSL).
• Securely hashed passwords using bcrypt.
• Regular security audits and monitoring.
• Access controls and authentication for all database operations.`,
              },
              {
                title: "4. Third-Party Services",
                content: `TFIverse integrates with the following third-party services:

• **Google OAuth:** If you choose to sign in with Google, we receive your name, email, and profile picture from Google. We do not access any other Google data.
• **Zoho Mail:** We use Zoho for transactional emails. Your email address is shared with Zoho solely for the purpose of email delivery.
• **Vercel:** Our application is hosted on Vercel's infrastructure.
• **Supabase:** Our database is hosted on Supabase's managed PostgreSQL service.`,
              },
              {
                title: "5. Your Rights",
                content: `You have the right to:

• **Access** your personal data stored on our platform.
• **Correct** inaccurate information in your profile.
• **Delete** your account and all associated data by contacting us.
• **Export** your data in a machine-readable format upon request.

To exercise any of these rights, contact us at **privacy@tfiverse.com** or **admin@tfiverse.com**.`,
              },
              {
                title: "6. Data Retention",
                content: `We retain your personal data for as long as your account is active. If you delete your account, we will remove your personal data within 30 days, except where we are required by law to retain certain information.`,
              },
              {
                title: "7. Children's Privacy",
                content: `TFIverse is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we discover that we have collected data from a child under 13, we will delete it promptly.`,
              },
              {
                title: "8. Changes to This Policy",
                content: `We may update this Privacy Policy from time to time. We will notify you of significant changes by posting a notice on our platform or sending you an email. Your continued use of TFIverse after changes are posted constitutes acceptance of the updated policy.`,
              },
              {
                title: "9. Contact Us",
                content: `If you have any questions about this Privacy Policy, please contact us:

• **Email:** admin@tfiverse.com
• **Support:** support@tfiverse.com`,
              },
            ].map((section) => (
              <div key={section.title}>
                <h2 className="text-xl font-black text-white tracking-tight mb-4">
                  {section.title}
                </h2>
                <div className="text-white/35 text-sm leading-relaxed whitespace-pre-line">
                  {section.content.split("**").map((part, i) =>
                    i % 2 === 1 ? (
                      <strong key={i} className="text-white/60 font-semibold">
                        {part}
                      </strong>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
