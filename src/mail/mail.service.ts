import { Inject, Injectable, Logger } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import { readFile } from 'fs/promises';
import { join } from 'path';

import mailConfig from './mail.config';
import { OtpEmailPayload, TraineeInvitePayload } from './mail.types';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  private readonly transporter: nodemailer.Transporter;

  private readonly templateCache = new Map<string, handlebars.TemplateDelegate>();

  private readonly templatesDir = join(__dirname, 'templates');

  constructor(
    @Inject(mailConfig.KEY)
    private readonly config: ConfigType<typeof mailConfig>,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.config.host,
      port: this.config.port,
      secure: this.config.secure,
      auth: {
        user: this.config.auth.user,
        pass: this.config.auth.pass,
      },
    });
  }

  async sendTraineeInvitation(payload: TraineeInvitePayload): Promise<void> {
    await this.dispatch(
      payload.to,
      `${payload.trainerName} invited you to Montu`,
      'trainee-invite',
      payload,
    );
  }

  async sendRegistrationOtp(payload: Omit<OtpEmailPayload, 'purpose'>): Promise<void> {
    await this.dispatch(payload.to, 'Confirm your email — Montu', 'registration-otp', payload);
  }

  async sendPasswordResetOtp(payload: Omit<OtpEmailPayload, 'purpose'>): Promise<void> {
    await this.dispatch(payload.to, 'Reset your password — Montu', 'forgot-password-otp', payload);
  }

  private async dispatch(
    to: string,
    subject: string,
    templateName: string,
    context: object,
  ): Promise<void> {
    if (process.env.NODE_ENV === 'testing') {
      this.logger.log(`Skipping email send in testing environment to ${to} — Subject: ${subject}`);
      return;
    }

    try {
      const html = await this.render(templateName, context);

      await this.transporter.sendMail({
        from: `${this.config.name} <${this.config.from}>`,
        to,
        subject,
        html,
      });

      this.logger.log(`Email sent to ${to} — Subject: ${subject}`);
    } catch (error) {
      this.logger.error(
        `Failed to send "${templateName}" to ${to}`,
        error instanceof Error ? error.stack : error,
      );

      throw error;
    }
  }

  private async render(templateName: string, context: object): Promise<string> {
    let template = this.templateCache.get(templateName);

    if (!template) {
      const templatePath = join(this.templatesDir, `${templateName}.hbs`);

      const rawTemplate = await readFile(templatePath, 'utf-8');

      template = handlebars.compile(rawTemplate);
      this.templateCache.set(templateName, template);
    }

    return template(context);
  }
}
