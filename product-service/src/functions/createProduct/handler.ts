import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { ddbDocumentClient } from '@libs/ddbClient';
import { v4 as uuidv4 } from 'uuid';
import { AvaliableProduct } from '@libs/models/Product'


import schema from './schema';

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  console.log('[createProduct] requests and arguments: ', event);
  try {
    const body = JSON.parse(event.body);
    const result = await createProductProcessing(body);
    return formatJSONResponse( result.body, result.statusCode);
  } catch (error) {
    console.error(error);
    return formatJSONResponse(error, 500);
  }
};

const createProductProcessing =  async (body:AvaliableProduct): Promise<any> | never => {
  const isBodyValid: boolean = createBodyValidator(body);
  if (!isBodyValid) {
    return {
      statusCode: 400,
      body: "Parameters are missed",
    };
  } else {
      const id: string = uuidv4();
      const productParams = {
          id,
          price: body.price,
          title: body.title,
          description: body.description,
      }
      const stockParams = {
          product_id: id,
          count: body.count
      };

      try {
        const put = async () => {
          await ddbDocumentClient
            .transactWrite({
              TransactItems: [
                {
                  Put: {
                    Item: productParams,
                    TableName: process.env.PRODUCTS_TABLE_NAME,
                  },
                },
                {
                  Put: {
                    Item: stockParams,
                    TableName: process.env.STOCKS_TABLE_NAME,
                  },
                },
              ],
            })
            .promise();
        };
        await put();
        return {
          statusCode: 201,
          body: {...body, id},
        };
      } catch (error) {
        return {
          statusCode: 500,
          body: JSON.stringify(error),
        };
      }
  }
}

const createBodyValidator = (body:AvaliableProduct): boolean  => {
  type TypeValidatorKeys = (keyof AvaliableProduct)[];
  const requiredKeys: TypeValidatorKeys = ['title', 'description', 'price', 'count'];
  const bodyKeys: TypeValidatorKeys = Object.keys(body) as TypeValidatorKeys;
  return requiredKeys.every((key) => bodyKeys.includes(key))
}

export const main = middyfy(createProduct);
