export default {
  Resources: {
    MyVPC: {
      Type: "AWS::EC2::VPC",
      Properties: {
        CidrBlock: "10.0.0.0/16",
        EnableDnsSupport: true,
        EnableDnsHostnames: true,
        InstanceTenancy: "default",
        Tags: [{ Key: "Name", Value: "MyVPC - cf" }],
      },
    },
    InternetGateway: {
      Type: "AWS::EC2::InternetGateway",
      DependsOn: "MyVPC",
      Properties: {
        Tags: [{ Key: "Name", Value: "MyInternetGateway" }],
      },
    },
    VPCGatewayAttachment: {
      Type: "AWS::EC2::VPCGatewayAttachment",
      DependsOn: "MyVPC",
      Properties: {
        VpcId: { Ref: "MyVPC" },
        InternetGatewayId: { Ref: "InternetGateway" },
      },
    },
    DataSourceSecurityGroup: {
      Type: "AWS::EC2::SecurityGroup",
      Properties: {
        GroupDescription: "Open database for access",
        VpcId: {
          Ref: "MyVPC",
        },
      },
    },
    DSSGIngressRule: {
      Type: "AWS::EC2::SecurityGroupIngress",
      Properties: {
        FromPort: "5432",
        ToPort: "5432",
        GroupId: {
          Ref: "DataSourceSecurityGroup",
        },
        IpProtocol: "tcp",
        CidrIp: "0.0.0.0/0",
        SourceSecurityGroupId: {
          Ref: "DataSourceSecurityGroup",
        },
      },
    },
    PublicSubnetA: {
      Type: "AWS::EC2::Subnet",
      Properties: {
        VpcId: { Ref: "MyVPC" },
        CidrBlock: "10.0.0.0/24",
        AvailabilityZone: "ap-southeast-2a",
        MapPublicIpOnLaunch: true,
        Tags: [{ Key: "Name", Value: "PublicSubnetA" }],
      },
    },
    PublicSubnetB: {
      Type: "AWS::EC2::Subnet",
      Properties: {
        VpcId: { Ref: "MyVPC" },
        CidrBlock: "10.0.1.0/24",
        AvailabilityZone: "ap-southeast-2b",
        MapPublicIpOnLaunch: true,
        Tags: [{ Key: "Name", Value: "PublicSubnetB" }],
      },
    },
    PublicRouteTable: {
      Type: "AWS::EC2::RouteTable",
      Properties: {
        VpcId: { Ref: "MyVPC" },
      },
    },
    PublicRoute: {
      Type: "AWS::EC2::Route",
      DependsOn: "VPCGatewayAttachment",
      Properties: {
        RouteTableId: { Ref: "PublicRouteTable" },
        DestinationCidrBlock: "0.0.0.0/0",
        GatewayId: { Ref: "InternetGateway" },
      },
    },
    PublicSubnetARouteTableAssociation: {
      Type: "AWS::EC2::SubnetRouteTableAssociation",
      Properties: {
        RouteTableId: { Ref: "PublicRouteTable" },
        SubnetId: { Ref: "PublicSubnetA" },
      },
    },
    PublicSubnetBRouteTableAssociation: {
      Type: "AWS::EC2::SubnetRouteTableAssociation",
      Properties: {
        RouteTableId: { Ref: "PublicRouteTable" },
        SubnetId: { Ref: "PublicSubnetB" },
      },
    },
    MyDBSubnetGroup: {
      Type: "AWS::RDS::DBSubnetGroup",
      Properties: {
        DBSubnetGroupName: "MyDBSubnetGroup",
        DBSubnetGroupDescription: "Subnet group for RDS instance",
        SubnetIds: [{ Ref: "PublicSubnetA" }, { Ref: "PublicSubnetB" }],
      },
    },
    MyDBInstance: {
      Type: "AWS::RDS::DBInstance",
      Properties: {
        DBName: "MyDatabase",
        Engine: "postgres",
        MasterUsername: "postgres",
        DBInstanceClass: "db.t3.micro",
        DBSubnetGroupName: { Ref: "MyDBSubnetGroup" },
        // DBSecurityGroups: [{ Ref: "DBSecurityGroup" }],

        AllocatedStorage: 5,
        MasterUserPassword: "GaryPassword",
        PubliclyAccessible: true,
      },
    },
    // DBSecurityGroup: {
    //   Type: "AWS::RDS::DBSecurityGroup",
    //   Properties: {
    //     DBSecurityGroupIngress: {
    //       EC2SecurityGroupName: "WebServerSecurityGroupMyDatabase",
    //     },
    //     GroupDescription: "Frontend Access",
    //   },
    // },

    // WebServerSecurityGroup: {
    //   Type: "AWS::EC2::SecurityGroup",
    //   Properties: {
    //     GroupDescription: "Enable HTTP access via port 80 and SSH access",
    //     GroupName: "WebServerSecurityGroupMyDatabase",
    //     SecurityGroupIngress: [
    //       { IpProtocol: "tcp", FromPort: 80, ToPort: 80, CidrIp: "0.0.0.0/0" },
    //       { IpProtocol: "tcp", FromPort: 22, ToPort: 22, CidrIp: "0.0.0.0/0" },
    //     ],
    //   },
    // },
  },
  Outputs: {
    DatabaseURL: {
      Description: "PostgreSQL Database URL",
      Value: {
        "Fn::Sub":
          "postgresql://${MyDBInstance.Endpoint.Address}:${MyDBInstance.Endpoint.Port}/MyDatabase",
      },
    },
  },
};
