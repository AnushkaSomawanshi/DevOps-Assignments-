# Terraform AWS EC2

Status: `REQUIRES TOOLING`

This configuration demonstrates Terraform provider, variables, resources, outputs, security-group rules, dependency relationships, and encrypted EBS for a bounded GyneCare EC2 exercise. It uses the account's default VPC and a caller-supplied subnet to avoid creating unnecessary network infrastructure.

## Prerequisites

- Terraform 1.6 or newer
- AWS credentials through the standard provider chain
- A verified region, AMI, subnet, and existing EC2 key pair
- Authorization to create and later destroy the instance

Copy `terraform.tfvars.example` to a local `terraform.tfvars` and replace every placeholder. The local file is ignored.

## Workflow

```bash
terraform init
terraform fmt
terraform fmt -check
terraform validate
terraform plan -var-file=terraform.tfvars
terraform apply -var-file=terraform.tfvars
terraform output
terraform destroy -var-file=terraform.tfvars
```

Do not run `apply` until credentials, region, AMI, key pair, subnet, cost, and expected resources have been reviewed. Do not destroy resources that were not created by this configuration.

## State

Terraform state is sensitive infrastructure metadata and must not be committed. This directory ignores local state and plugin directories. A team deployment should use encrypted remote state and locking, with access controlled separately.

## Requirement mapping

| Requirement | Implementation |
|---|---|
| Provider | `versions.tf`, `provider.tf` |
| Variables | `variables.tf`, `terraform.tfvars.example` |
| EC2 resource | `main.tf` |
| Security group | `main.tf` |
| Outputs | `outputs.tf` |
| State protection | `.gitignore` and this guide |
