import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'import',
        cors: true,
        request: {
          parameters: {
            querystrings: {
              name: true,
            },
          },
        },
        authorizer: {
          arn: 'arn:aws:lambda:eu-central-1:125248424854:function:authorization-service-dev-basicAuthorizer',
          resultTtlInSeconds: 0,
          identitySource: "method.request.header.Authorization",
          type: 'request',
        }
      },
    },
  ],
};

