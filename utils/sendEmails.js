const dotenv = require('dotenv').config();

const nodemailer = require('nodemailer');
module.exports = async (email, subject, text) => {
    try{
        const transporter = nodemailer.createTransport({
            host: process.env.HOST,
            service: process.env.SERVICE,
            port: process.env.EMAIL_PORT,
            secure: true,
            auth:{
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            }
        });
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            html: text,
        })
        console.log('email sent')
    } catch (err) {
        console.log('not sent'),
        console.log(err)
    }
}