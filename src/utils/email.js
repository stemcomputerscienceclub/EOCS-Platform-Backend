import nodemailer from 'nodemailer';
import { config } from '../config/index.js';

export const sendEmail = async (options) => {
  // Create reusable transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    host: config.email.host,
    port: config.email.port,
    secure: config.email.secure,
    auth: {
      user: config.email.auth.user,
      pass: config.email.auth.pass,
    },
  });

  // Message object
  const message = {
    from: `${process.env.FROM_NAME} <${config.email.auth.user}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  // Send mail with defined transport object
  const info = await transporter.sendMail(message);

  console.log('Message sent: %s', info.messageId);
}; 