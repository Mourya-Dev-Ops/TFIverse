import { Resend } from 'resend';
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { TFiverseEmail } from "@/emails/TFiverseEmail";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const sesClient = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
  ? new SESClient({
      region: process.env.AWS_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    })
  : null;

const transporter = process.env.ZOHO_SMTP_USER && process.env.ZOHO_SMTP_PASS
  ? nodemailer.createTransport({
      host: "smtppro.zoho.in",
      port: 465,
      secure: true, // true for 465
      auth: {
        user: process.env.ZOHO_SMTP_USER,
        pass: process.env.ZOHO_SMTP_PASS,
      },
    })
  : null;

interface SendEmailProps {
  to: string;
  subject: string;
  html: string;
  fromOverride?: string;
}

async function sendEmail({ to, subject, html, fromOverride }: SendEmailProps) {
  const from = fromOverride || process.env.EMAIL_FROM || "noreply@tfiverse.com";

  // Priority 1: Zoho SMTP (Nodemailer)
  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"TFIverse" <${from}>`,
        to,
        subject,
        html,
      });
      return { success: true };
    } catch (error) {
      console.error("Zoho SMTP error:", error);
      // Fallback
    }
  }

  // Priority 2: AWS SES
  if (sesClient) {
    try {
      const command = new SendEmailCommand({
        Destination: { ToAddresses: [to] },
        Message: {
          Body: { Html: { Data: html } },
          Subject: { Data: subject },
        },
        Source: from,
      });
      await sesClient.send(command);
      return { success: true };
    } catch (error) {
      console.error("AWS SES error:", error);
      // Fallback to Resend if available
    }
  }

  // Priority 2: Resend
  if (resend) {
    try {
      await resend.emails.send({
        from,
        to,
        subject,
        html,
      });
      return { success: true };
    } catch (error) {
      console.error("Resend error:", error);
    }
  }

  console.error("No email service configured or all failed.");
  return { success: false, error: "Email service unavailable" };
}

interface VerificationEmailProps {
  email: string;
  token: string;
  name: string;
}

export async function sendVerificationEmail({ email, token, name }: VerificationEmailProps) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email/confirm?token=${token}`;
  
  const html = await render(
    TFiverseEmail({
      name,
      url: verificationUrl,
      type: "verification",
    })
  );

  return sendEmail({ to: email, subject: "🎬 Verify your TFiverse account", html });
}

export async function sendPasswordResetEmail({ email, token, name }: VerificationEmailProps) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  const html = await render(
    TFiverseEmail({
      name,
      url: resetUrl,
      type: "reset",
    })
  );

  return sendEmail({ to: email, subject: "🔐 Reset your TFiverse password", html });
}
