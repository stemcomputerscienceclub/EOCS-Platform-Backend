import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
  if (!process.env.EMAIL_SERVICE || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('Email not configured. Set EMAIL_SERVICE, EMAIL_USER, and EMAIL_PASS in .env');
    return;
  }

  // Create reusable transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Message object
  const message = {
    from: `${process.env.FROM_NAME || 'EOCS'} <${process.env.FROM_EMAIL || process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  // Send mail with defined transport object
  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
}; 