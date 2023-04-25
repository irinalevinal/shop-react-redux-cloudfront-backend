import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        arn: "catalogItemsQueue",
        batchSize: 5,
      },
    }
  ],
};