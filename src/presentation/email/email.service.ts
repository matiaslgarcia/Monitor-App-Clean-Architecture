import nodemailer from 'nodemailer';
import { envs } from '../../config/plugins/envs.plugins';

export interface SendMailOptions {
    to: string,
    subject: string,
    htmlBody: string,
    attachments?: Attachments[];
}

interface Attachments {
    filename: string,
    path: string
}


export class EmailService {

    private transporter = nodemailer.createTransport({
        service: envs.MAILER_SERVICE,
        auth: {
            user: envs.MAILER_EMAIL,
            pass: envs.MAILER_SECRET_KEY
        }
    })

    constructor(
    ) { }

    async sendEmail(options: SendMailOptions): Promise<boolean> {
        const { to, subject, htmlBody, attachments = [] } = options

        try {
            await this.transporter.sendMail({
                to,
                subject,
                html: htmlBody,
                attachments
            });

            return true
        } catch (error) {
            return false
        }
    }

    async sendEmailWIthFSLogs(to: string | string[]) {
        const subjects = 'Logs del servidor'
        const htmlBody = `
                <h2>Logs del sistema - NOC</h2>
                <p> Lorem ipsuttt</p>
                <p>Ver logs adjuntos</p>
            `

        const attachments: Attachments[] = [
            { filename: 'logs-low.log', path: './logs/logs-low.log' },

            { filename: 'logs-medium.log', path: './logs/logs-medium.log' },

            { filename: 'logs-high.log', path: './logs/logs-high.log' }
        ]

        return await this.transporter.sendMail({
            to,
            subject: subjects,
            html: htmlBody,
            attachments
        });

    }
}