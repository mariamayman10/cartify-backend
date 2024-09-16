import nodemailer from 'nodemailer';

export const sendMail = async(options:any) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    const emailOptions = {
        from: `"${process.env.APP_NAME}" <${process.env.EMAIL_USERNAME}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: `<div style="padding:2%;margin:2%"><h1>${options.subject}</h1><p>${options.message}</p></div>`,

    };
    await transporter.sendMail(emailOptions);
}

