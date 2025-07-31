import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export async function sendVerificationEmail(email, token) {
  const transporter = nodemailer.createTransport({
    service: "gmail", // or use host/smtp config below
    auth: {
      user: process.env.GMAIL_USER, // your Gmail address
      pass: process.env.GMAIL_PASS, // your Gmail App Password (not regular password)
    },
  });

  const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
  const verifyLink = `${CLIENT_URL}/verify?token=${token}`;

  const info = await transporter.sendMail({
    from: `"TaskNest" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Verify your Email",
    html: `
      <h2>Email Verification</h2>
      <p>Click the link below to verify your email:</p>
      <a href="${verifyLink}">Verify Now</a>
    `,
  });

  console.log("Verification email sent:", info.messageId);
}
