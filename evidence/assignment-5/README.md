# Assignment 5 Implementation Evidence Register

| Evidence ID | Requirement | Evidence Type | Required Demonstration | Status |
|---|---|---|---|---|
| A5-E01 | Terraform initialization | Command-Line Evidence | Successful `terraform init` | REQUIRES TOOLING |
| A5-E02 | Terraform formatting | Validation Evidence | `terraform fmt -check` result | REQUIRES TOOLING |
| A5-E03 | Terraform validation | Validation Evidence | Successful `terraform validate` | REQUIRES TOOLING |
| A5-E04 | Planned resources | Infrastructure Evidence | Reviewed `terraform plan` | REQUIRES CREDENTIALS |
| A5-E05 | EC2 provisioning | Deployment Evidence | Actual EC2 resource created by Terraform | EXECUTION PENDING |
| A5-E06 | Cleanup | Lifecycle Evidence | Actual Terraform destroy result | EXECUTION PENDING |

Store authentic Terraform command output, reviewed plans, infrastructure records, and cleanup results here after execution. Do not store expected output or infrastructure identifiers without a corresponding execution record.
