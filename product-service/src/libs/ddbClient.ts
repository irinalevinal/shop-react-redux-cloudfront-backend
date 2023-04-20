// Create service client module using ES6 syntax.
import { DynamoDB } from 'aws-sdk';

// Set the AWS Region.
const REGION = process.env.AWS_REGION || "eu-central-1"; //e.g. "us-east-1"
// Create an Amazon DynamoDB service client object.
const ddbClient = new DynamoDB({ region: REGION });

const ddbDocumentClient = new DynamoDB.DocumentClient();

//function to fill table with data
function fillInTable( table: string, data: DynamoDB.Types.BatchWriteItemInput): void {
    console.log(`LOG: filling ${table} -->> product`);
    ddbClient.batchWriteItem(data, function (err) {
        if (err) {
            console.log(`LOG: filling table -->> ${table} -->> ERROR`);
            console.log(err);
        } else {
            console.log(`LOG: filling table -->> ${table} -->> SUCCESS`);
        }
    })
}


export { ddbDocumentClient, fillInTable };

