import type { AWS } from '@serverless/typescript';

import getProductsList from '@functions/getProductsList';
import getProductsById from '@functions/getProductsById';
import createProduct from '@functions/createProduct';
import catalogBatchProcess from '@functions/catalogBatchProcess';

const serverlessConfiguration: AWS = {
  service: 'product-service',
  
  frameworkVersion: '3',
  plugins: ['serverless-auto-swagger', 'serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-central-1',
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: "sqs:*",
            Resource: "arn:aws:sqs:eu-central-1:125248424854:catalogItemsQueue"
          }, {
            Effect: "Allow",
            Action: "sns:*",
            Resource: "arn:aws:sqs:eu-central-1:125248424854:createProductTopic"
          }, {
            Effect: "Allow",
            Action: [
              "dynamodb:DescribeTable",
              "dynamodb:Query",
              "dynamodb:Scan",
              "dynamodb:GetItem",
              "dynamodb:PutItem",
              "dynamodb:UpdateItem",
              "dynamodb:DeleteItem",
            ],
            Resource: 'arn:aws:dynamodb:eu-central-1:*:*'
            // 'arn:aws:dynamodb:eu-central-1*:*'
            // 'arn:aws:dynamodb:us-east-1:*:*'
          }
        ]
      }
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      PRODUCTS_TABLE_NAME: 'products',
      STOCKS_TABLE_NAME: 'stocks',
      SNS_SUB_EMAIL: 'irina_levina@epam.com',
      SNS_FREE_PRODUCT_SUB_EMAIL: 'irina_levina@epam.com',
      SNS_CREATE_PRODUCT_TOPIC: 'createProductTopic',
      SNS_REGION: 'eu-central-1'
    },
  },
  
  // import the function via paths
  functions: { getProductsList, getProductsById, createProduct, catalogBatchProcess},
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    autoswagger: {
        typefiles: ['./src/libs/models/Product.ts'],
        host: 'xuohj4pat5.execute-api.eu-central-1.amazonaws.com/dev',
        generateSwaggerOnDeploy: false,
        //excludeStages: ['production', 'anyOtherStage'],
    },
  },
  resources: {
    Resources: {
      catalogItemsQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: 'catalogItemsQueue'
        }
      },
      createProductTopic: {
          Type: "AWS::SNS::Topic",
          Properties: {
            TopicName: 'createProductTopic'
          }
      },
      ConfigtionalEmailSubscriptionLess100: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'irina.levina@gmail.com',
          Protocol: 'email',
          TopicArn: {
            Ref: 'createProductTopic'
          },
          FilterPolicyScope: 'MessageBody',
          FilterPolicy: {
            price: [{ "numeric": ["<", 100] }]
          }
        }
      },
      ConfigtionalEmailSubscriptionMore100: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'irina_levina@epam.com',
          Protocol: 'email',
          TopicArn: {
            Ref: 'createProductTopic'
          },
          FilterPolicyScope: 'MessageBody',
          FilterPolicy: {
            price: [{ "numeric": [">=", 100] }]
          }
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
