export default {
  Type: "AWS::SQS::Queue",
  Properties: {
    QueueName: "${self:custom.mailQueue.name}",
  },
};
