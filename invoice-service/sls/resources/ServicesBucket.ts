export default {
  ServicesBucket: {
    Type: "AWS::S3::Bucket",
    Properties: {
      BucketName: "${self:custom.ServicesBucket.name}",
      LifecycleConfiguration: {
        Rules: [
          { Id: "ExpirePictures", Status: "Enabled", ExpirationInDays: 365 },
        ],
      },
    },
  },
  ServicesBucketPolicy: {
    Type: "AWS::S3::BucketPolicy",
    Properties: {
      Bucket: { Ref: "ServicesBucket" },
      PolicyDocument: {
        Statement: [
          {
            Sid: "PublicRead",
            Effect: "Allow",
            Principal: "*",
            Action: ["s3:GetObject"],
            Resource: "arn:aws:s3:::${self:custom.ServicesBucket.name}/*",
          },
        ],
      },
    },
  },
};
