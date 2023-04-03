import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { products } from '../mock';

import schema from './schema';

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {

  const availableProducts = products.map(
    (product, index) => ({ ...product, count: index + 1 })
  );
  await resolveAfter1Seconds(); //TODO: remove after DB is connected
  
  const product = availableProducts.find((p) => p.id == event.pathParameters.productId);
  if (!product) {
    return formatJSONResponse({error: {message: "Product is not found"}}, 404);
  }
  return formatJSONResponse({...product});
};

function resolveAfter1Seconds() { //TODO: remove after DB is connected
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('resolved');
    }, 2000);
  });
}

export const main = middyfy(getProductsById);
