import nodemailer from "nodemailer";

interface EmailData {
    to: string;
    subject: string;
    html: string
}

export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST || 'smtp.ethereal.email',
            port: parseInt(process.env.MAIL_PORT || '587', 10),
            secure: process.env.MAIL_SECURE === 'true',
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            }
        });
    }

    async send({to, subject, html}: EmailData): Promise<void> {

        const mailOptions: nodemailer.SendMailOptions = {
            from: `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_ADDRESS}>`,
            to,
            subject,
            html,
        };

        await this.transporter.sendMail(mailOptions);
    }
}