import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { ddbDocumentClient } from '@libs/ddbClient';


import schema from './schema';

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log('[getProductsById] request and arguments: ', event);
  try {
      const productTableParams = {
        TableName: process.env.PRODUCTS_TABLE_NAME,
        Key: {
          "id": event.pathParameters.productId, 
          }, 
      };

      const stocksTableParams = {
        TableName: process.env.STOCKS_TABLE_NAME,
        Key: {
          "product_id": event.pathParameters.productId, 
         }, 
      }

      const product = await ddbDocumentClient.get(productTableParams).promise()
      const stock = await ddbDocumentClient.get(stocksTableParams).promise()

      const result = {
        ...product.Item,
        count: stock.Item?.count
      }

      if (!product.Item) {
        return formatJSONResponse({error: {message: "Product is not found"}}, 404);
      }

      return formatJSONResponse({...result});
  } catch (error) {
      console.error(error);
      return formatJSONResponse(error, 500);
  }
};


export const main = middyfy(getProductsById);
