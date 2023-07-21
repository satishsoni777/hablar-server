import nodemailer from 'nodemailer';



const sendEmail = async function (req, callback) {
    const to = req.body.emailId;
    let mailTransporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
            user: 'hablarinc@hotmail.com',
            pass: 'Loca@754'
        }
    });
    const otp = Math.floor(100000 + Math.random() * 900000);
    let mailDetails = {
        from: 'hablarinc@hotmail.com',
        to: to,
        subject: 'OTP Authentication',
        text: `Your OTP is: ${otp}`,
    };

    mailTransporter.sendMail(mailDetails).then((error, res) => {
        if (error) {
            return callback(error, null);
        }
        else {
            return callback(null, res);
        }
    });
}
const EmailSendUtil = { sendEmail };
export { EmailSendUtil };