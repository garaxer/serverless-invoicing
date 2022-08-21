import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/uploadInvoicePicture.handler`,
  events: [
    {
      http: {
        method: "PATCH",
        path: "/invoice/{id}/picture",
        authorizer: "${self:custom.authorizer}",
      },
    },
  ],
};
