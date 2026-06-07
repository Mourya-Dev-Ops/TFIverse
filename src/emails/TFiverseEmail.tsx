import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface TFiverseEmailProps {
  name: string;
  url: string;
  type: "verification" | "reset";
}

export const TFiverseEmail = ({ name, url, type }: TFiverseEmailProps) => {
  const isVerification = type === "verification";

  return (
    <Html>
      <Head />
      <Preview>
        {isVerification 
          ? "Welcome to TFiverse! Verify your email to enter the universe." 
          : "Reset your TFiverse password"}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>
            {isVerification ? "Welcome to TFiverse" : "Reset Password"}
          </Heading>
          
          <Text style={text}>
            {isVerification ? `Hey ${name},` : `Hi ${name},`}
          </Text>
          
          <Text style={text}>
            {isVerification
              ? "Thanks for joining the ultimate cinematic database. We're thrilled to have you here. Please verify your email address to unlock all features."
              : "We received a request to reset your password. Click the button below to set a new one. If you didn't request this, you can safely ignore this email."}
          </Text>
          
          <Section style={buttonContainer}>
            <Link style={button} href={url}>
              {isVerification ? "Verify Email" : "Reset Password"}
            </Link>
          </Section>
          
          <Text style={footer}>
            — The TFiverse Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: "#000000",
  fontFamily:
    "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif",
};

const container = {
  margin: "40px auto",
  padding: "40px",
  backgroundColor: "#111111",
  borderRadius: "16px",
  border: "1px solid #333333",
  maxWidth: "600px",
};

const h1 = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "600",
  margin: "0 0 20px 0",
  textAlign: "center" as const,
};

const text = {
  color: "#aaaaaa",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 20px 0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "30px 0",
};

const button = {
  backgroundColor: "#ffffff",
  color: "#000000",
  padding: "14px 32px",
  borderRadius: "4px",
  fontWeight: "600",
  fontSize: "14px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  textTransform: "uppercase" as const,
  letterSpacing: "2px",
};

const footer = {
  color: "#666666",
  fontSize: "14px",
  marginTop: "40px",
};

export default TFiverseEmail;
