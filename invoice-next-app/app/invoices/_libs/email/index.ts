import { MailService, MailDataRequired } from "@sendgrid/mail";
import { SendEmailParams } from "./types";
import config from "../../config";

export const createEmailClient = () => {
  if (!config.sendGridApiKey) {
    throw new Error("no sendgrid api key found");
  }

  console.log("Making email client");
  const sgMail = new MailService();
  sgMail.setApiKey(config.sendGridApiKey);
  console.log("Setting auth for email client");

  return {
    send: async (params: SendEmailParams) => {
      const msg: MailDataRequired = {
        to: params.to,
        from: params.from,
        subject: params.subject,
        html: `<html><head></head><body>${params.html}</body></html>`,
        mailSettings: {
          sandboxMode: {
            enable: config.enableSandboxMode,
          },
        },
      };

      if (params.text) {
        msg.text = params.text;
      }

      if (params.attachments) {
        msg.attachments = params.attachments;
      }

      try {
        const response = await sgMail.send(msg);
        console.log("send_email_success Email successfully sent", {
          to: params.to,
          from: params.from,
          subject: params.subject,
          responseHeaders: response[0].headers,
        });
        return response[0].headers["x-message-id"] ?? "";
      } catch (error) {
        console.log("send_email_error sending email", {
          to: params.to,
          from: params.from,
          subject: params.subject,
          error: JSON.stringify(error),
        });
        return "";
      }
    },
  };
};
