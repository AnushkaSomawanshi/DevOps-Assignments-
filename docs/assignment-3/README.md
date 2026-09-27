# Assignment 3 — Infrastructure as Code (IaC) with Terraform

## Overview
Assignment 3 automates the provisioning and security hardening of the **GyneCare Hospital Management System** AWS EC2 compute infrastructure using HashiCorp Terraform.

## Aim & Objective
- Transform manual cloud configuration into declarative, reproducible, version-controlled Infrastructure as Code.
- Define AWS compute (`aws_instance`), network security (`aws_security_group`), and storage (`root_block_device` encrypted gp3) resources.
- Parameterize infrastructure configurations using strongly-typed Terraform variables.
- Expose necessary non-sensitive outputs while keeping private keys, credentials, and state files strictly isolated from Git.
- Execute and document the full Terraform lifecycle: `init` -> `validate` -> `fmt` -> `plan` -> `apply` -> `destroy`.

## Technologies Used
- **IaC Tool**: HashiCorp Terraform (>= 1.6.0)
- **Cloud Provider**: AWS Provider (~> 5.0)
- **Infrastructure**: AWS EC2, Default VPC Lookup, Security Group, Encrypted gp3 EBS
- **Configuration Language**: HashiCorp Configuration Language (HCL)

## Important Files
- [`infrastructure/terraform/aws-ec2/versions.tf`](../../infrastructure/terraform/aws-ec2/versions.tf) — Provider and Terraform version constraints
- [`infrastructure/terraform/aws-ec2/provider.tf`](../../infrastructure/terraform/aws-ec2/provider.tf) — AWS provider declaration
- [`infrastructure/terraform/aws-ec2/variables.tf`](../../infrastructure/terraform/aws-ec2/variables.tf) — Typed input variable definitions
- [`infrastructure/terraform/aws-ec2/main.tf`](../../infrastructure/terraform/aws-ec2/main.tf) — EC2 instance and security group definitions
- [`infrastructure/terraform/aws-ec2/outputs.tf`](../../infrastructure/terraform/aws-ec2/outputs.tf) — Exported infrastructure attributes
- [`infrastructure/terraform/aws-ec2/terraform.tfvars.example`](../../infrastructure/terraform/aws-ec2/terraform.tfvars.example) — Safe variable template
- [`infrastructure/terraform/aws-ec2/.gitignore`](../../infrastructure/terraform/aws-ec2/.gitignore) — Excludes state files and secrets

## Core Workflow Commands
```bash
cd infrastructure/terraform/aws-ec2

# 1. Initialize working directory
terraform init

# 2. Check formatting and validate syntax
terraform fmt -check
terraform validate

# 3. Create execution plan
terraform plan

# 4. Provision infrastructure (when authorized)
terraform apply

# 5. Clean up infrastructure
terraform destroy
```

## Detailed Documentation
For detailed architectural breakdowns, variable schemas, and state protection practices, see:
- [Assignment 3 Technical Documentation](assignment-3-documentation.md)
