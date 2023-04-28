export default {
  Effect: "Allow",
  Action: ["sqs:SendMessage"],
  Resource: "${self:custom.MailQueue.arn}",
};
