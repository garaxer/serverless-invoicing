export default {
  Effect: "Allow",
  Action: ["sqs:ReceiveMessage"],
  Resource: "${self:custom.mailQueue.arn}",
};
