export const BASE_URL =
  "https://bpqc2pxzub.execute-api.ap-southeast-2.amazonaws.com";

const config = {
  emailFrom: process.env.EMAIL_FROM ?? "gbagnall8@gmail.com",
  emailTo: process.env.EMAIL_FROM ?? "gbagnall8@gmail.com",
  sendGridApiKey: process.env.SENDGRID_API_KEY,
  enableSandboxMode: false, //process.env.STAGE === 'local' && process.env.SENDGRID_SANDBOX_MODE === 'true' ? true : false,
} as const;

export default config;
