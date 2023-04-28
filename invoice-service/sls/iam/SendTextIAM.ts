export default [
  {
    Effect: "Deny",
    Action: ["sns:Publish"],
    Resource: "arn:aws:sns:*:*:*",
  },
  {
    Effect: "Allow",
    Action: ["sns:Publish"],
    Resource: "*",
  },
];
// Only allow SMS
// https://stackoverflow.com/questions/38871201/authorization-when-sending-a-text-message-using-amazonsnsclient