import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { customErrorResponse, internalServerErrorResponse } from '@libs/api-gateway';
import s3Repository from '@libs/s3.repository';

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const csvFileName = event.queryStringParameters.name;
    const bucketName = `${process.env.S3_BUCKET_PRODUCTS}`;

    if (!csvFileName) return customErrorResponse({ error: { message: 'query param [name] must be specified' } }, 404);

    const presignedUrl = await s3Repository.getSignedUrl(`uploaded/${csvFileName}`, bucketName);

    return formatJSONResponse({ presignedUrl });
  } catch (error) {
    return internalServerErrorResponse();
  }
};

export const main = middyfy(importProductsFile);