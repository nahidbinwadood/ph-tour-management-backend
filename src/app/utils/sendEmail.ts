/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from 'nodemailer';
import AppError from '../errorHelpers/AppError';
import httpStatus from 'http-status-codes';
import path from 'path';
import ejs from 'ejs';
import { envVars } from '../config/env';

interface ISendEmailPayload {
  to: string;
  subject: string;
  templateName: string;
  templateValues: Record<string, any>;
}

const transporter = nodemailer.createTransport({
  secure: true,
  auth: {
    user: envVars.SMTP_USER,
    pass: envVars.SMTP_PASS,
  },
  port: Number(envVars.SMTP_PORT),
  host: envVars.SMTP_HOST,
});

export const sendMail = async ({
  to,
  subject,
  templateName,
  templateValues,
}: ISendEmailPayload) => {
  try {
    const templatePath = path.join(
      __dirname,
      'templates',
      `${templateName}.ejs`
    );

    const html = await ejs.renderFile(`${templatePath}`, templateValues);

    const email = await transporter.sendMail({
      from: envVars.SMTP_FROM,
      to,
      subject,
      html,
    });

    console.log(`\u2709\uFE0F Email sent to ${to}: ${email.messageId}`);
  } catch (error: any) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      error.message || 'Failed to send email'
    );
  }
};
