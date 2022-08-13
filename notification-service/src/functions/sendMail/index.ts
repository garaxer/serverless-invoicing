import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        arn: "${self:custom.mailQueue.arn}",
        batchSize: 1 //1 email at a time
      },
    },
  ],
};
