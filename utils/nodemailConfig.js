const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'marshel.aillon@gmail.com', // cuenta de la empresa
    pass: process.env.EMAIL_CODE,
  },
});

transporter.verify().then(() => {
  console.log('Verificación de nodemailer');
});

module.exports = transporter;
