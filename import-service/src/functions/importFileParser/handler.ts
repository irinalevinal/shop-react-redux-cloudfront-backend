import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';

import schema from './schema';
import { internalServerErrorResponse } from '../../libs/api-gateway';
import s3Repository from '@libs/s3.repository';
import { SQS } from 'aws-sdk';


const importFileParser: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    console.log('***** file parser log *****')
    const bucketName = `${process.env.S3_BUCKET_PRODUCTS}`;
    const key = (event as any).Records[0].s3.object.key;

    const sqs = new SQS({ region: `${process.env.SQS_REGION}` });

    const stream = await s3Repository.getStreamObject(key, bucketName);

    for await (const data of stream) {
      await sqs
        .sendMessage({
          QueueUrl: `${process.env.SQS_PRODUCT_QUEUE}`,
          MessageBody: JSON.stringify(data),
        },
        (error, data) => {
                  if (error) {
                    console.log('ERROR IN SQS MESSAGE POST', error)
                  } else {
                    console.log('DATA SENT INTO SQS', data)
                  }
                }
        ).promise();;
    }

    await s3Repository.copyObject(key, bucketName, 'uploaded/', 'parsed/');
    await s3Repository.deleteObject(key, bucketName);

    return formatJSONResponse({ message: 'succeed' });

  } catch (error) {
    return internalServerErrorResponse();
  }
};

export const main = importFileParser;