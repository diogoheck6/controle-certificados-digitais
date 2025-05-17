import nodemailer from 'nodemailer';

export const sendEmail = (subject: string, htmlMessage: string, isHtml = false) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.NEXT_PUBLIC_EMAIL_USER,
            pass: process.env.NEXT_PUBLIC_EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.NEXT_PUBLIC_EMAIL_USER,
        to: process.env.NEXT_PUBLIC_EMAIL_RECIPIENTS,
        subject,
        html: isHtml ? htmlMessage : undefined,
        text: isHtml ? undefined : htmlMessage,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erro ao enviar email:', error);
        } else {
            console.log('Email enviado: ' + info.response);
        }
    });
};