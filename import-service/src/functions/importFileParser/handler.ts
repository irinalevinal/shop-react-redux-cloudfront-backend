import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';

import schema from './schema';
import { internalServerErrorResponse } from '../../libs/api-gateway';
import s3Repository from '@libs/s3.repository';

const importFileParser: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    console.log('***** file parser log *****')
    const bucketName = `${process.env.S3_BUCKET_PRODUCTS}`;
    const key = (event as any).Records[0].s3.object.key;

    console.log('===== KEY =====', key);

    const file = await s3Repository.getStreamObject(key, bucketName);

    console.log('--- file chunks ---', file)

    await s3Repository.copyObject(key, bucketName, 'uploaded/', 'parsed/');
    await s3Repository.deleteObject(key, bucketName);

    return formatJSONResponse({ message: 'succeed' });

  } catch (error) {
    return internalServerErrorResponse();
  }
};

export const main = importFileParser;