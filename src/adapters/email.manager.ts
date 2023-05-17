import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailManager {
  constructor(private readonly mailerService: MailerService) {}

  async sendConfirmationCode(emailRecipient, confirmationCode) {
    const emailContent = ` <h1>Thank for your registration</h1>
                    <p>To finish registration please follow the link below:
                    <a href='https://localhost:3000/confirm-email?code=${confirmationCode}'>complete registration</a>
                    </p>`;

    await this.send(emailRecipient, emailContent);
  }

  async send(emailRecipient, htmlContent) {
    this.mailerService
      .sendMail({
        to: emailRecipient, // list of receivers
        from: 'blog-api', // sender address
        subject: 'blog-api', // Subject line
        text: 'asd', // plaintext body
        html: htmlContent, // HTML body content
      })
      .catch((e) => console.log(e));
  }
}
