const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'virtualeventst3@gmail.com',
    pass: process.env.EMAIL_CODE,
  },
});

transporter.verify().then(() => {
  console.log('Verificación de nodemailer');
});

module.exports = transporter;
