import { formatJSONResponse } from '@libs/api-gateway';
import { internalServerErrorResponse } from '../../../../import-service/src/libs/api-gateway';
import { SQSEvent } from 'aws-lambda';
import { SNS } from 'aws-sdk';
import { createProductProcessing } from '../createProduct/handler';

const catalogBatchProcess = async (event: SQSEvent) => {
  try {
    const sns = new SNS({ region: `${process.env.SNS_REGION}`});
    const records = event.Records.map(({ body }) => JSON.parse(body));

    const joined = await Promise.all(
      records.map(({ title, description, price, count, id }) => {
        return {
          product: { title, description, price, id, count }
        }
      })
    );

    for await (let { product } of joined) {
      console.log('***** Product processing *****', { product });

      await createProductProcessing({ ...product });
      
      await sns.publish({
        Message: `New product ${product.title} was created`,
        Subject: 'AWS Product Creation',
        TopicArn: 'createProductTopic',
        MessageAttributes: {
          price: {
            DataType: 'Number',
            StringValue: product.price
          }
        }
      }, (error) => {
        if (error) {
          console.log('***** ERROR *****', error);
        } else {
          console.log('Product creatoin message was sent')
        }
      })
    }

    return formatJSONResponse({ message: 'succeed' });
  } catch (error) {
    console.log('==== ERROR ====', error.message)
    return internalServerErrorResponse();
  }
};

export const main = catalogBatchProcess;