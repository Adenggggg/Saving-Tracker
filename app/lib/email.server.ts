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