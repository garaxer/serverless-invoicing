
export interface EmailContent {
  subject: string;
  body: string;
}

export type Attachment = {
  content: string;
  filename: string;
  type: string;
  disposition: string;
};

export interface SendGridSenderProps {
  name: string;
  email: string;
}
export interface SendEmailParams {
  to: string[];
  from: SendGridSenderProps;
  subject: string;
  text?: string;
  html: string;
  attachments?: Attachment[];
}
