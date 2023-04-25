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

// const getStreamObject = async (key: string, bucket: string) => {
//     const object = await getObject(key, bucket);
//     const readStream = object.createReadStream();

//     const streamChunks = [];

//     return await new Promise((resolve, reject) => {
//       readStream
//         .pipe(csv())
//         .on("data", function (data: any) {
//           streamChunks.push(data);
//         })
//         .on("end", function () {
//           resolve(streamChunks);
//         })
//         .on("error", function (error) {
//           console.error(error.message)
//           reject("error processing csv file");
//         });
//     });
// }

const getStreamObject = async (key: string, bucket: string) => (await getObject(key, bucket)).createReadStream().pipe(csv());

export default {
    copyObject,
    deleteObject,
    getObject,
    getSignedUrl,
    getStreamObject
}







