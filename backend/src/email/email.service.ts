import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('SMTP_HOST'),
            port: this.configService.get('SMTP_PORT'),
            auth: {
                user: this.configService.get('SMTP_USER'),
                pass: this.configService.get('SMTP_PASSWORD'),
            },
        });
    }

    async sendVerificationEmail(email: string, token: string, firstName?: string) {
        const verificationUrl = `${this.configService.get('FRONTEND_URL')}/verify-email?token=${token}`;

        const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .button { 
              display: inline-block; 
              padding: 12px 24px; 
              background-color: #2563eb; 
              color: white; 
              text-decoration: none; 
              border-radius: 6px; 
              margin: 20px 0;
            }
            .footer { margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Подтвердите ваш email</h2>
            <p>Привет${firstName ? `, ${firstName}` : ''}!</p>
            <p>Спасибо за регистрацию! Пожалуйста, подтвердите ваш email адрес, нажав на кнопку ниже:</p>
            <a href="${verificationUrl}" class="button">Подтвердить email</a>
            <p>Или скопируйте эту ссылку в браузер:</p>
            <p style="word-break: break-all; color: #2563eb;">${verificationUrl}</p>
            <p>Эта ссылка действительна в течение 24 часов.</p>
            <div class="footer">
              <p>Если вы не регистрировались на нашем сайте, просто проигнорируйте это письмо.</p>
              <p>С уважением,<br>Команда Личного кабинета</p>
            </div>
          </div>
        </body>
      </html>
    `;

        await this.transporter.sendMail({
            from: this.configService.get('SMTP_FROM'),
            to: email,
            subject: 'Подтвердите ваш email',
            html,
        });
    }

    async sendPasswordResetEmail(email: string, token: string, firstName?: string) {
        const resetUrl = `${this.configService.get('FRONTEND_URL')}/reset-password?token=${token}`;

        const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .button { 
              display: inline-block; 
              padding: 12px 24px; 
              background-color: #dc2626; 
              color: white; 
              text-decoration: none; 
              border-radius: 6px; 
              margin: 20px 0;
            }
            .warning { 
              background-color: #fef3c7; 
              border-left: 4px solid #f59e0b; 
              padding: 12px; 
              margin: 20px 0;
            }
            .footer { margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Сброс пароля</h2>
            <p>Привет${firstName ? `, ${firstName}` : ''}!</p>
            <p>Мы получили запрос на сброс пароля для вашего аккаунта.</p>
            <p>Нажмите на кнопку ниже, чтобы создать новый пароль:</p>
            <a href="${resetUrl}" class="button">Сбросить пароль</a>
            <p>Или скопируйте эту ссылку в браузер:</p>
            <p style="word-break: break-all; color: #dc2626;">${resetUrl}</p>
            <div class="warning">
              <strong>⚠️ Важно:</strong> Эта ссылка действительна только 1 час.
            </div>
            <div class="footer">
              <p>Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо. Ваш пароль останется без изменений.</p>
              <p>С уважением,<br>Команда Личного кабинета</p>
            </div>
          </div>
        </body>
      </html>
    `;

        await this.transporter.sendMail({
            from: this.configService.get('SMTP_FROM'),
            to: email,
            subject: 'Сброс пароля',
            html,
        });
    }

    async sendPasswordChangedEmail(email: string, firstName?: string) {
        const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .success { 
              background-color: #d1fae5; 
              border-left: 4px solid: #10b981; 
              padding: 12px; 
              margin: 20px 0;
            }
            .footer { margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Пароль успешно изменен</h2>
            <p>Привет${firstName ? `, ${firstName}` : ''}!</p>
            <div class="success">
              <strong>✅ Успешно:</strong> Ваш пароль был успешно изменен.
            </div>
            <p>Если это были не вы, немедленно свяжитесь с нами.</p>
            <div class="footer">
              <p>С уважением,<br>Команда Личного кабинета</p>
            </div>
          </div>
        </body>
      </html>
    `;

        await this.transporter.sendMail({
            from: this.configService.get('SMTP_FROM'),
            to: email,
            subject: 'Пароль изменен',
            html,
        });
    }
}
