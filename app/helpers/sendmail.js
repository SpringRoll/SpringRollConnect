const nodemailer = require('nodemailer');

module.exports = function(mailOptions, callback) {
  let transportConfig;

  const canSendSmtp = process.env.SMTP_USER !== undefined && process.env.SMTP_PASSWORD !== undefined && process.env.SMTP_HOST !== undefined;
  if (canSendSmtp) {
    transportConfig = {
      host: process.env.SMTP_HOST,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    };
  } else {
    transportConfig = {
      service: 'Gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
      }
    };
  }

  const transporter = nodemailer.createTransport(transportConfig);
  transporter.sendMail(mailOptions, callback);
};
