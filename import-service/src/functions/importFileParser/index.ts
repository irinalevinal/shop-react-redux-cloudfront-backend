import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        event: 's3:ObjectCreated:*',
        bucket: "shop-react-redux-cloudfront-cloudx-products",
        existing: true,
        rules: [{ prefix: 'uploaded/' }]
      }
    }
  ],
};