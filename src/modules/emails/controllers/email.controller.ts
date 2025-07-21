import nodemailer from 'nodemailer';
import { SMTP_HOST, SMTP_PASS, SMTP_PORT, SMTP_USER } from '@Configs/constants';

const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT || '587'),
    secure: parseInt(SMTP_PORT || '587') === 465,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        await transporter.sendMail({
            from: `"Auth API" <${SMTP_USER}>`,
            to,
            subject,
            html,
        });
        console.log(`Email enviado a ${to}`);
    } catch (error) {
        console.error('Error al enviar email:', error);
    }
};