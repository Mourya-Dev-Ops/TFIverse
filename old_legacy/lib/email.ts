import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendVerificationEmailProps {
  email: string;
  token: string;
  name: string;
}

export async function sendVerificationEmail({
  email,
  token,
  name,
}: SendVerificationEmailProps) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email/confirm?token=${token}`;

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: email,
      subject: '🎬 Verify your TFiverse account',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                background-color: #000000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                padding: 0;
                margin: 0;
              }
              .container {
                max-width: 600px;
                margin: 40px auto;
                background: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 16px;
                padding: 40px;
              }
              .logo {
                text-align: center;
                font-size: 32px;
                font-weight: bold;
                margin-bottom: 30px;
              }
              .logo-tfi {
                color: #E50914;
              }
              .logo-verse {
                color: #ffffff;
              }
              .title {
                color: #ffffff;
                font-size: 24px;
                font-weight: 600;
                margin-bottom: 20px;
                text-align: center;
              }
              .message {
                color: rgba(255,255,255,0.8);
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 30px;
                text-align: center;
              }
              .button-container {
                text-align: center;
                margin-bottom: 30px;
              }
              .button {
                display: inline-block;
                background-color: #E50914;
                color: #ffffff;
                text-decoration: none;
                padding: 14px 32px;
                border-radius: 8px;
                font-weight: 600;
                font-size: 16px;
              }
              .footer {
                color: rgba(255,255,255,0.5);
                font-size: 14px;
                text-align: center;
                margin-top: 30px;
              }
              .link {
                color: rgba(255,255,255,0.6);
                word-break: break-all;
                font-size: 12px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="logo">
                <span class="logo-tfi">TFi</span><span class="logo-verse">verse</span>
              </div>
              <h1 class="title">Welcome ${name}! 🎬</h1>
              <p class="message">
                Thanks for signing up! Click the button below to verify your email address and start your movie journey.
              </p>
              <div class="button-container">
                <a href="${verificationUrl}" class="button">Verify Email</a>
              </div>
              <p class="message">
                Or copy this link into your browser:
              </p>
              <p class="link">${verificationUrl}</p>
              <p class="footer">
                If you didn't create this account, you can safely ignore this email.
              </p>
            </div>
          </body>
        </html>
      `,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error };
  }
}
