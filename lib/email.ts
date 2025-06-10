import { createTransport } from "nodemailer"

export function createEmailTransport() {
  return createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD
    }
  });
}

export async function sendVerificationEmail({ 
  email, 
  url, 
  from 
}: { 
  email: string; 
  url: string; 
  from: string;
}) {
  const { host } = new URL(url)
  const transport = createEmailTransport()

  const result = await transport.sendMail({
    to: email,
    from,
    subject: `Login Link - ${host}`,
    text: `Sign in to ${host}\n\nClick here to sign in:\n${url}\n`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Sign in to ${host}</h2>
        <p>Click the button below to sign in:</p>
        <a href="${url}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Sign In
        </a>
        <p>Or copy and paste this link: ${url}</p>
      </div>
    `,
  })

  const failed = result.rejected.concat(result.pending).filter(Boolean)
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`)
  }

  return result
} 