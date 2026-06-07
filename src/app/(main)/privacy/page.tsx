import { Metadata } from "next";
import Footer from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Privacy Policy — TFIverse",
  description: "Read the TFIverse privacy policy. Learn how we collect, use, and protect your personal data.",
};

export default function PrivacyPage() {
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
              Privacy Policy
            </h1>
            <p className="text-white/40 text-[13px] font-medium">
              Last updated: {lastUpdated}
            </p>
          </header>

          <article className="py-16 space-y-12">
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
