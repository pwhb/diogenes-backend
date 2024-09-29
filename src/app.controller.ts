import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { Public } from './auth/auth.guard';
import { ConfigsController } from './configs/configs.controller';
import { ConfigsService } from './configs/configs.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly configsService: ConfigsService,
  ) {}
  @Public()
  @Get()
  getHello(): object {
    return this.appService.getHello();
  }

  @Post('sendEmail')
  async sendEmail(@Body() body: any) {
    const config = await this.configsService.get('TEMPLATES');
    const data = await this.mailerService.sendMail({
      to: body.to,
      from: `${this.configService.get('MAIL_SENDERNAME')} <${this.configService.get('MAIL_USER')}>`,
      subject: body.subject,
      text: body.text,
      html: config.value['email-verification'],
    });
    return data;
  }
}
