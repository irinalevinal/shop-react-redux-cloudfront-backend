import { S3 } from 'aws-sdk';
const csv = require("csv-parser");
const s3Params = { region: `${process.env.S3_REGION}` };
const s3 = new S3(s3Params);

const getObject = async (key, bucket) => {
    console.log('*****file parser log*****');
    console.log('===== KEY =====', key);

    const objectParams = {
      Bucket: bucket,
      Key: key,
    }

    return s3.getObject(objectParams)
}

const copyObject = async (key: string, bucket: string, startFolder: string, destinationFolder: string) => await s3.copyObject({
    Bucket: bucket,
    CopySource: `${bucket}/${key}`,
    Key: key.replace(startFolder, destinationFolder),
  })
  .promise();

const deleteObject = async (key, bucket) => await s3.deleteObject({
    Bucket: bucket,
    Key: key,
  })
  .promise();

const getSignedUrl = async (key, bucket) => {
    const params = {
        Bucket: bucket,
        Key: key,
        ContentType: 'text/csv'
      }

    return s3.getSignedUrl("putObject", params);
}

const getStreamObject = async (key: string, bucket: string) => (await getObject(key, bucket)).createReadStream().pipe(csv());

export default {
    copyObject,
    deleteObject,
    getObject,
    getSignedUrl,
    getStreamObject
}







