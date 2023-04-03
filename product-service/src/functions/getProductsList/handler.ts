import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { products } from './../mock';

import schema from './schema';

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  const avaliableProducts = products.map(
    (product, index) => ({ ...product, count: index + 1 })
  );

  return formatJSONResponse(avaliableProducts);
};

export const main = middyfy(getProductsList);
