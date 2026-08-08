import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendReminderEmail(to: string, name: string, groupName: string) {
  await transporter.sendMail({
    from: `"${groupName}" <${process.env.GMAIL_USER}>`,
    to,
    subject: `Reminder: your ${groupName} contribution is pending`,
    text: `Hi ${name},\n\nFriendly reminder that your contribution for this week is still pending. Whenever you get the chance, please settle it so we stay on track for the goal!\n\nThanks,\n${groupName}`,
    html: `
      <p>Hi ${name},</p>
      <p>Friendly reminder that your contribution for this week is still <strong>pending</strong>.
      Whenever you get the chance, please settle it so we stay on track for the goal!</p>
      <p>Thanks,<br/>${groupName}</p>
    `,
  });
}

export async function sendMagicLinkEmail(to: string, name: string, groupName: string, link: string) {
  await transporter.sendMail({
    from: `"${groupName}" <${process.env.GMAIL_USER}>`,
    to,
    subject: `Your login link for ${groupName}`,
    text: `Hi ${name},\n\nClick this link to log in to ${groupName} (expires in 15 minutes):\n${link}\n\nIf you didn't request this, you can ignore this email.`,
    html: `
      <p>Hi ${name},</p>
      <p>Click below to log in to <strong>${groupName}</strong>. This link expires in 15 minutes.</p>
      <p><a href="${link}" style="display:inline-block;padding:10px 20px;background:#0e3d2c;color:#ffffff;border-radius:999px;text-decoration:none;">Log In</a></p>
      <p style="color:#888;font-size:12px;">If you didn't request this, you can safely ignore this email.</p>
    `,
  });
}