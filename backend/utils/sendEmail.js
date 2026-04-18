const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a transporter using SMTP
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // Prepare email message contents
  const message = {
    from: `${process.env.FROM_NAME || 'Placement Portal'} <${process.env.FROM_EMAIL || process.env.SMTP_EMAIL}>`,
    to: options.email,       // single receiver or primary receivers
    bcc: options.bcc,        // blind carbon copy for bulk mailing
    subject: options.subject,
    text: options.message,   // plain text body
    html: options.html,      // optionally send HTML
  };

  // If using testing/development without credentials, log instead of failing.
  if(!process.env.SMTP_EMAIL) {
    console.warn(`[Mock Email] To: ${options.email} | Subject: ${options.subject}`);
    return;
  }

  const info = await transporter.sendMail(message);
  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
