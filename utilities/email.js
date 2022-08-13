const nodeMailer = require('nodemailer');

const sendEmail = options => {
    //)Create a Transporter
    const transporter = nodeMailer.transporter({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    //2)Defining Email Options
    const mailOptions={
        from:"Sarthak Moriya sarthak8544@gmail.com",
        to:options.email,
        subject:options.subject,
        message:options.message
    }

    //3)Send the Email

    transporter.sendMail(mailOptions)
}

module.exports= sendEmail