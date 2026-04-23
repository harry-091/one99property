import nodemailer from "nodemailer";
import { query } from "../config/db.js";
import { env } from "../config/env.js";

const transporter =
  env.smtp.host && env.smtp.user && env.smtp.pass
    ? nodemailer.createTransport({
        host: env.smtp.host,
        port: env.smtp.port,
        secure: false,
        auth: {
          user: env.smtp.user,
          pass: env.smtp.pass
        }
      })
    : null;

export const logNotification = async ({ leadId = null, userId = null, type, channel = "system", subject, message }) =>
  query(
    `INSERT INTO notification_logs (lead_id, user_id, type, channel, subject, message)
     VALUES (:leadId, :userId, :type, :channel, :subject, :message)`,
    { leadId, userId, type, channel, subject, message }
  );

export const sendEmailNotification = async ({ to, subject, html, leadId = null, userId = null, type = "general" }) => {
  if (!to) return;

  if (transporter) {
    await transporter.sendMail({
      from: env.smtp.from,
      to,
      subject,
      html
    });
  }

  await logNotification({
    leadId,
    userId,
    type,
    channel: "email",
    subject,
    message: html.replace(/<[^>]+>/g, " ")
  });
};

