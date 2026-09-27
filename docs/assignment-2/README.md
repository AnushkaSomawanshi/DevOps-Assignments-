# Assignment 2 — AWS EC2 Cloud Deployment

## Overview
Assignment 2 details the deployment of the **GyneCare Hospital Management System** onto an Amazon Web Services (AWS) Elastic Compute Cloud (EC2) virtual machine, covering the full infrastructure lifecycle from provisioning and security configuration to application deployment and resource teardown.

## Aim & Objective
- Demonstrate the selection, configuration, security hardening, and deployment of GyneCare onto an AWS EC2 virtual machine.
- Configure VPC subnets, route tables, and Security Groups to restrict access to trusted IPs.
- Establish secure SSH key pair management and remote host execution.
- Validate application responsiveness via the `/api/health` endpoint and monitor instance performance via AWS CloudWatch.
- Enforce cost optimization by stopping or terminating cloud resources after verification.

## Technologies Used
- **Cloud Infrastructure**: AWS EC2 (`t2.micro` / `t3.micro`, Ubuntu 22.04 LTS), Amazon VPC, Security Groups, EBS (gp3 encrypted)
- **Networking & Access**: SSH (`.pem` key authentication), AWS Internet Gateway
- **Runtime Environment**: Node.js 20, npm, Git
- **Application**: GyneCare Express REST API Server
- **Monitoring**: AWS CloudWatch metrics

## Important Files & Commands
- [`server/server.js`](../../server/server.js) — Backend application deployed to EC2
- [`.env.example`](../../.env.example) — Template for instance environment variables
- `ssh -i <key.pem> ubuntu@<EC2_PUBLIC_IP>` — Secure remote connection
- `curl http://<EC2_PUBLIC_IP>:5000/api/health` — Application health validation
- `aws ec2 stop-instances` / `aws ec2 terminate-instances` — Lifecycle cleanup

## Detailed Documentation
For complete step-by-step setup guides, security configurations, and architecture diagrams, refer to:
- [Assignment 2 Technical Documentation](assignment-2-documentation.md)
