// import schema from './schema';
import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'products/{productId}',
        responseData: {
          200: {
            description: 'Product is found',
            bodyType: 'AvaliableProduct'
          },
          404: {
            description: 'Product is not found'
          }
        },
      },
    },
  ],
};
