import type { AWS } from '@serverless/typescript';

import importProductsFile from '@functions/importProductsFile';
import importFileParser from '@functions/importFileParser';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    region: 'eu-central-1',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              "s3:ListBucket"
            ],
            Resource: "arn:aws:s3:::shop-react-redux-cloudfront-cloudx-products"
          },
          {
            Effect: 'Allow',
            Action: [
              "s3:*"
            ],
            Resource: "arn:aws:s3:::shop-react-redux-cloudfront-cloudx-products/*"
          }
        ]
      },
    },
    environment: {
      S3_BUCKET_PRODUCTS: "shop-react-redux-cloudfront-cloudx-products",
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      S3_REGION: "${self:provider.region}"
    },
  },


    // "functions": {
      
    //   "importFileParser": {
    //     "handler": "handlers/importFileParser.handler",
    //     "events": [
    //       {
    //         "s3": {
    //           "bucket": "${self:custom.PRODUCTS_BUCKET}",
    //           "event": "s3:ObjectCreated:*",
    //           "rules": [
    //             {
    //               "prefix": "${self:custom.FOLDER_TO_UPLOAD}/"
    //             }
    //           ],
    //           "existing": true
    //         }
    //       }
    //     ]
    //   }
    // },
  
  // import the function via paths
  functions: { importProductsFile, importFileParser },
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
  },
};

module.exports = serverlessConfiguration;
