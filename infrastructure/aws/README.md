# AWS Configuration Area

Status: `DOCUMENTED`

This directory is reserved for bounded AWS service configuration artifacts that have a clear purpose and can be validated safely. No live AWS resource definition is placed here until the service scope, credentials, cost, and cleanup path are defined.

The current EC2 Terraform implementation is in `infrastructure/terraform/aws-ec2/`. Assignment 3 documents S3, Lambda, RDS, ELB, and ECS without claiming that every service is deployed.
