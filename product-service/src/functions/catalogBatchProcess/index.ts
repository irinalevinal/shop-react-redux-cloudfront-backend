import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        arn: "arn:aws:sqs:eu-central-1:125248424854:catalogItemsQueue",
        batchSize: 5,
      },
    }
  ],
};