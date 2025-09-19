const nodemailer = require('nodemailer')
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD  // app password, not the actual gmail password
    }

})

async function sendAnEmail(toEmail, subject, text){
    const mailOptions = {
        from: process.env.GMAIL_EMAIL,
        to: toEmail,
        subject: subject,
        text, text
    }

    try {
        let sendEmail =  await transporter.sendMail(mailOptions)

        console.log('Email sent')
        console.log(sendEmail.response)

        return true

    } catch(err) {
        console.error('Error sending email')
        console.error(err)
        throw Error
    }
}

module.exports = { sendAnEmail }