# Assignment 3 — Implementation Evidence Guide

This directory holds the verification artifacts and execution proof for **Assignment 3: Terraform Infrastructure as Code**.

## Required Evidence Checklist

1. **Terraform CLI & Provider Initialization**: Terminal capture of `terraform init` showing successful AWS provider plugin installation.
2. **Formatting & Syntax Validation**: Terminal output of `terraform fmt -check` and `terraform validate` confirming clean configuration syntax.
3. **Execution Plan**: Terminal output of `terraform plan` showing declarative planned resources (`aws_instance.gynecare`, `aws_security_group.gynecare`).
4. **Infrastructure State & Outputs**: Terminal output of `terraform output` demonstrating computed non-sensitive metadata (`instance_id`, `security_group_id`).
5. **Security & State Protection**: Confirmation of `.gitignore` excluding `*.tfstate`, `*.tfvars`, and `.terraform/`.

For the detailed technical report, see [Assignment 3 Documentation](../../docs/assignment-3/assignment-3-documentation.md).
