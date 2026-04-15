/* eslint-disable prettier/prettier */
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
        context:{email,today,username}
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw new InternalServerErrorException(
        'Failed to send login notification',
      );
    }
  }
}
