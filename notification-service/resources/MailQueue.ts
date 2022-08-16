export default {
  Type: "AWS::SQS::Queue",
  Properties: {
    QueueName: "${self:custom.mailQueue.name}",
  },
};

export const MailQueueOutputs = {
  MailQueueArn: {
    Value: "${self:custom.mailQueue.arn}",
    Export: {
      Name: "${self:custom.mailQueue.name}-Arn",
    },
  },
  MailQueueUrl: {
    Value: "${self:custom.mailQueue.url}",
    Export: {
      Name: "${self:custom.mailQueue.name}-Url",
    },
  },
};