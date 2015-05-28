var nodemailer = require('nodemailer');

module.exports = function(mailOptions, callback)
{
	var transporter = nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: process.env.GMAIL_USER,
			pass: process.env.GMAIL_PASSWORD
		}
	});
	transporter.sendMail(mailOptions, callback);
};