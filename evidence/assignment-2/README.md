# Assignment 2 — Implementation Evidence Guide

This directory holds the verification artifacts and execution proof for **Assignment 2: Cloud Computing & AWS EC2 Deployment**.

## Required Evidence Checklist

1. **EC2 Instance Provisioning**: AWS Management Console or AWS CLI output displaying instance ID, region, AMI, VPC, subnet, and security group.
2. **Secure SSH Connection**: Terminal capture showing successful SSH session initialization into the Linux EC2 host using private key authentication.
3. **Application Setup**: Terminal commands demonstrating Git clone, Node.js installation, and dependency configuration.
4. **Health Verification**: Terminal curl output verifying `GET /api/health` responsiveness.
5. **CloudWatch Monitoring**: AWS CloudWatch console capture displaying instance metrics (`CPUUtilization`, `StatusCheckFailed`).
6. **Instance Decommissioning**: Record of stopping or terminating the instance to prevent cloud billing drift.

For the detailed technical report, see [Assignment 2 Documentation](../../docs/assignment-2/assignment-2-documentation.md).
