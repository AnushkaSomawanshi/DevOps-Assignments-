# Assignment 3 — Infrastructure as Code (IaC) with Terraform for AWS EC2

## 1. Assignment Title
**Automating GyneCare Cloud Infrastructure Provisioning Using Terraform and AWS EC2**

## 2. Aim
To explore Infrastructure as Code (IaC) principles, understand declarative configuration management, and automate the provisioning, security hardening, and lifecycle management of AWS EC2 compute infrastructure for the GyneCare application using HashiCorp Terraform.

## 3. Objectives
- Understand the core concepts of Infrastructure as Code: declarative vs. imperative syntax, providers, state management, and idempotency.
- Define modular, reusable Terraform configuration files (`.tf`) for AWS EC2, Security Groups, and EBS storage.
- Parameterize environment attributes using typed Terraform input variables without exposing secrets.
- Expose calculated infrastructure metadata through structured output values.
- Practice the standard Terraform operational workflow: `init`, `fmt`, `validate`, `plan`, `apply`, and `destroy`.
- Implement rigorous state file and credential exclusion practices via `.gitignore`.

## 4. Learning Outcomes
- Designing infrastructure declaratively using HashiCorp Configuration Language (HCL).
- Managing infrastructure lifecycle state (`terraform.tfstate`) and understanding state locking and drift.
- Configuring least-privilege security group rules for web traffic (Ports 80/443) and restricted administrative SSH (Port 22).
- Ensuring cloud cost control through planned, previewed, and auditable resource lifecycles.

## 5. Infrastructure Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Terraform Orchestration                         │
│                                                                        │
│   ┌────────────────────┐     ┌───────────────────┐     ┌───────────┐   │
│   │ provider.tf /      │ ──> │ Execution Plan    │ ──> │ AWS Cloud │   │
│   │ main.tf / vars.tf  │     │ (terraform plan)  │     │ APIs      │   │
│   └────────────────────┘     └───────────────────┘     └─────┬─────┘   │
└──────────────────────────────────────────────────────────────┼─────────┘
                                                               │ Provisions
                                                               ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      AWS Target Infrastructure                         │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                     Default VPC Lookup                         │   │
│   │                                                                │   │
│   │   ┌────────────────────────────────────────────────────────┐   │   │
│   │   │     Security Group: gynecare-dev-web                   │   │   │
│   │   │     • Port 22 (Restricted admin CIDR)                  │   │   │
│   │   │     • Port 80 & 443 (Public web traffic)               │   │   │
│   │   │                                                        │   │   │
│   │   │   ┌────────────────────────────────────────────────┐   │   │   │
│   │   │   │   EC2 Instance: gynecare-dev                   │   │   │   │
│   │   │   │   • Instance Type: var.instance_type           │   │   │   │
│   │   │   │   • AMI: var.ami_id                            │   │   │   │
│   │   │   │   • Key Pair: var.key_name                     │   │   │   │
│   │   │   │   • Storage: gp3 Root EBS (Encrypted, 20 GiB)  │   │   │   │
│   │   │   └────────────────────────────────────────────────┘   │   │   │
│   │   └────────────────────────────────────────────────────────┘   │   │
│   └────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

## 6. Repository Components & File Structure

The Terraform configuration resides in `infrastructure/terraform/aws-ec2/`:

| File Name | Purpose |
|---|---|
| [`versions.tf`](../../infrastructure/terraform/aws-ec2/versions.tf) | Declares required Terraform CLI (>= 1.6.0) and AWS provider (~> 5.0) constraints |
| [`provider.tf`](../../infrastructure/terraform/aws-ec2/provider.tf) | Configures AWS provider settings and default region from variables |
| [`variables.tf`](../../infrastructure/terraform/aws-ec2/variables.tf) | Defines typed inputs (`aws_region`, `project_name`, `environment`, `ami_id`, etc.) |
| [`main.tf`](../../infrastructure/terraform/aws-ec2/main.tf) | Resources: VPC lookup, Security Group ingress/egress, EC2 instance, encrypted EBS |
| [`outputs.tf`](../../infrastructure/terraform/aws-ec2/outputs.tf) | Exposes non-sensitive outputs (`instance_id`, `public_ip`, `security_group_id`) |
| [`terraform.tfvars.example`](../../infrastructure/terraform/aws-ec2/terraform.tfvars.example) | Safe example values template (never committed with actual keys or account secrets) |
| [`.gitignore`](../../infrastructure/terraform/aws-ec2/.gitignore) | Explicitly ignores `*.tfstate`, `*.tfstate.*`, `.terraform/`, and `*.tfvars` |

## 7. Terraform Workflow

### Step 1: Initialization (`terraform init`)
Initializes the working directory, downloads the HashiCorp AWS provider plugin, and sets up backend state tracking:
```bash
cd infrastructure/terraform/aws-ec2
terraform init
```

### Step 2: Formatting & Syntax Validation (`terraform fmt` & `terraform validate`)
Ensures standard HCL indentation and verifies that attribute references and variable types are syntactically sound:
```bash
terraform fmt -check
terraform validate
```

### Step 3: Execution Planning (`terraform plan`)
Generates an execution plan by querying current state against desired configuration, detailing planned resource additions (+), changes (~), or destructions (-):
```bash
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with account-specific AMI ID, Subnet ID, Key Name, and admin IP
terraform plan -out=tfplan
```

### Step 4: Provisioning (`terraform apply`)
Applies the vetted execution plan against AWS APIs:
```bash
terraform apply tfplan
```

### Step 5: Output Inspection (`terraform output`)
Retrieves computed metadata such as public IP and security group ID:
```bash
terraform output
```

### Step 6: Teardown & Destruction (`terraform destroy`)
Safely de-provisions all managed resources to prevent unexpected cloud charges:
```bash
terraform destroy
```

## 8. Security & State Protection
1. **Zero Credential Commits**: AWS access keys and secret keys are never defined in `.tf` or `.tfvars` files. Authentication relies on environment variables (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`) or AWS IAM roles.
2. **State Protection**: `terraform.tfstate` may contain computed resource IDs and configuration data; it is excluded from Git via `.gitignore`.
3. **EBS Encryption**: The root volume is configured with `encrypted = true` using AWS KMS default keys to secure healthcare application data at rest.
4. **SSH CIDR Scoping**: Inbound SSH access is strictly constrained via `var.ssh_cidr_blocks` to an administrator's specific `/32` CIDR address.

## 9. Conclusion
Assignment 3 demonstrates how manual cloud operations from Assignment 2 are converted into reproducible, auditable, and automated Infrastructure as Code using Terraform. This bridges the gap between infrastructure configuration and modern DevOps automation.
