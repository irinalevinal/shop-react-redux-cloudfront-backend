import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { ddbDocumentClient } from '@libs/ddbClient';
import schema from './schema';

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  console.log('[getProductsList] request');

  try {
      const productTableParams = {
          TableName: process.env.PRODUCTS_TABLE_NAME,
      };

      const stocksTableParams = {
        TableName: process.env.STOCKS_TABLE_NAME,
      }

      const products = await ddbDocumentClient.scan(productTableParams).promise()
      const stocks = await ddbDocumentClient.scan(stocksTableParams).promise()
      
      const result = products.Items.map((product) => ({
          ...product,
          count: stocks.Items.find(({ product_id }) => product_id === product.id)?.count || 0
      }))

      return formatJSONResponse(result);
  } catch (error) {
      console.error(error);
      return formatJSONResponse(error, 500);
  }

  
};

export const main = middyfy(getProductsList);
