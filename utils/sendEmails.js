const dotenv = require('dotenv').config();

const nodemailer = require('nodemailer');
module.exports = async (email, subject, text) => {
    try{
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            service: 'gmail',
            port: 587,
            secure: true,
            auth:{
                user: 'makeguitartabs@gmail.com',
                pass: 'qsvlssduadasxqew',
            }
        });
        await transporter.sendMail({
            from: process.env.USER,
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