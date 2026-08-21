import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  public async sendLoginEmail(email: string, username: string) {
    console.log('Attempting to send email...');
    try {
      const today = new Date();
      await this.mailerService.sendMail({
        to: email,
        subject: `New login detected - ${today.toDateString()}`,
        template: 'login',
        context: { email, today, username },
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw new InternalServerErrorException(
        'Failed to send login notification',
      );
    }
  }

  public async sendVerifyEmailTemplate(email: string, link: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: '"No Reply" <no-reply@nestjs.com>',
        subject: `verify your account`,
        template: 'verify-email',
        context: { link },
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw new InternalServerErrorException(
        'Failed to send verification email',
      );
    }
  }

    public async sendResetPasswordTemplate(email: string,link: string) {
    try {
      await this.mailerService.sendMail({
        to: email,
        from: '"No Reply" <no-reply@nestjs.com>',
        subject: `reset Password `,
        template: 'verify-email',
        context: { link },
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw new InternalServerErrorException(
        'Failed to send verification email',
      );
    }
  }
}
