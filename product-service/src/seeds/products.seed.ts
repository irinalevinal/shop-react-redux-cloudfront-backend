import { DynamoDB } from 'aws-sdk';
import { fillInTable } from "@libs/ddbClient";

// Set the parameters
export const productsData: DynamoDB.Types.BatchWriteItemInput = {// Import required AWS SDK clients and commands for Node.js
  RequestItems: {
    products: [
        {
            PutRequest: {
                Item: {
                    'id': { S: '7567ec4b-b10c-48c5-9345-fc73c48a32ja' },
                    'title': { S: 'Product title 1' },
                    'description': { S: 'Short Product Description1' },
                    'price': { N: '299' }
                }
            }
        },
        {
            PutRequest: {
                Item: {
                    'id': { S: '7567ec4b-b10c-48c5-9345-fc73c48a80aa' },
                    'title': { S: 'Product title 2' },
                    'description': { S: 'Short Product Description2' },
                    'price': { N: '299' }
                }
            }
        }, {
            PutRequest: {
                Item: {
                    'id': { S: '7567ec4b-b10c-48c5-9345-fc73c48a80a2' },
                    'title': { S: 'Product title 4' },
                    'description': { S: 'Product title 4' },
                    'price': { N: '169' }
                }
            }
        }, {
            PutRequest: {
                Item: {
                    'id': { S: '7567ec4b-b10c-48c5-9345-fc73c48a80a3' },
                    'title': { S: 'Product title 3' },
                    'description': { S: 'Short Product Description3' },
                    'price': { N: '99' }
                }
            }
        }, {
            PutRequest: {
                Item: {
                    'id': { S: '7567ec4b-b10c-48c5-9345-fc73c48a80a4' },
                    'title': { S: 'Product title 5' },
                    'description': { S: 'Short Product Description5' },
                    'price': { N: '99' }
                }
            }
        }, {
            PutRequest: {
                Item: {
                    'id': { S: '7567ec4b-b10c-48c5-9345-fc73c48a80a5' },
                    'title': { S: 'Product title 6' },
                    'description': { S: 'Short Product Description6' },
                    'price': { N: '159' }
                }
            }
        }, {
            PutRequest: {
                Item: {
                    'id': { S: '7567ec4b-b10c-48c5-9345-fc73c48a80a6' },
                    'title': { S: 'Product title 7' },
                    'description': { S: 'Short Product Description7' },
                    'price': { N: '159' }
                }
            }
        }, {
            PutRequest: {
                Item: {
                    'id': { S: '7567ec4b-b10c-48c5-9345-fc73c48a80a7' },
                    'title': { S: 'Product title 8' },
                    'description': { S: 'Short Product Description8' },
                    'price': { N: '79' }
                }
            }
        }, {
            PutRequest: {
                Item: {
                    'id': { S: '7567ec4b-b10c-48c5-9345-fc73c48a80a8' },
                    'title': { S: 'Product title 9' },
                    'description': { S: 'Short Product Description9' },
                    'price': { N: '79' }
                }
            }
        }
    ],
  },
};

fillInTable('products' ,productsData);


