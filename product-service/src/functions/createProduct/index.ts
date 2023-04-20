// import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'products',
        bodyType: 'ProductInterface',
        responseData: {
          200: {
            description: 'Product is created',
            bodyType: 'ProductInterface'
          },
        },
      },
    },
  ],
};
