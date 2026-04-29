import { Resend } from 'resend';
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

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

interface SendEmailProps {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail({ to, subject, html }: SendEmailProps) {
  const from = process.env.EMAIL_FROM || "onboarding@resend.dev";

  // Priority 1: AWS SES
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
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 0; margin: 0; }
          .container { max-width: 600px; margin: 40px auto; background: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 40px; }
          .title { color: #ffffff; font-size: 24px; font-weight: 600; margin-bottom: 20px; text-align: center; }
          .message { color: rgba(255,255,255,0.8); font-size: 16px; line-height: 1.6; margin-bottom: 30px; text-align: center; }
          .button-container { text-align: center; margin-bottom: 30px; }
          .button { display: inline-block; background-color: #ffffff; color: #000000; text-decoration: none; padding: 14px 32px; border-radius: 4px; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="title">Welcome ${name}!</h1>
          <p class="message">Thanks for joining the ultimate cinematic database. Click the button below to verify your email address.</p>
          <div class="button-container">
            <a href="${verificationUrl}" class="button">Verify Email</a>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({ to: email, subject: "🎬 Verify your TFiverse account", html });
}

export async function sendPasswordResetEmail({ email, token, name }: VerificationEmailProps) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { background-color: #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 0; margin: 0; }
          .container { max-width: 600px; margin: 40px auto; background: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 40px; }
          .title { color: #ffffff; font-size: 24px; font-weight: 600; margin-bottom: 20px; text-align: center; }
          .message { color: rgba(255,255,255,0.8); font-size: 16px; line-height: 1.6; margin-bottom: 30px; text-align: center; }
          .button-container { text-align: center; margin-bottom: 30px; }
          .button { display: inline-block; background-color: #ffffff; color: #000000; text-decoration: none; padding: 14px 32px; border-radius: 4px; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1 class="title">Reset Password</h1>
          <p class="message">Hey ${name}, we received a request to reset your TFiverse password. Click below to set a new one.</p>
          <div class="button-container">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({ to: email, subject: "🔐 Reset your TFiverse password", html });
}
