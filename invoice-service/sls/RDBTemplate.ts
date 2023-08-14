export default {
  DBInstance: {
    Type: "AWS::RDS::DBInstance",
    Properties: {
      DBName: { Ref: "DBName" },
      Engine: "MySQL",
      MasterUsername: { Ref: "DBUsername" },
      DBInstanceClass: { Ref: "DBClass" },
      DBSecurityGroups: [{ Ref: "DBSecurityGroup" }],
      AllocatedStorage: { Ref: "DBAllocatedStorage" },
      MasterUserPassword: { Ref: "DBPassword" },
    },
  },

  DBSecurityGroup: {
    Type: "AWS::RDS::DBSecurityGroup",
    Properties: {
      DBSecurityGroupIngress: {
        EC2SecurityGroupName: {
          "Fn::GetAtt": ["WebServerSecurityGroup", "GroupName"],
        },
      },
      GroupDescription: "Frontend Access",
    },
  },

  WebServerSecurityGroup: {
    Type: "AWS::EC2::SecurityGroup",
    Properties: {
      GroupDescription: "Enable HTTP access via port 80 and SSH access",
      SecurityGroupIngress: [
        { IpProtocol: "tcp", FromPort: 80, ToPort: 80, CidrIp: "0.0.0.0/0" },
        { IpProtocol: "tcp", FromPort: 22, ToPort: 22, CidrIp: "0.0.0.0/0" },
      ],
    },
  },
};
