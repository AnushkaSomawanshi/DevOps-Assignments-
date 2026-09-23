# Cost Management

Status: `DOCUMENTED`

This repository does not claim current AWS prices. Actual cost depends on region, account, usage, free-tier eligibility, data transfer, and resource settings.

| Resource | Cost considerations | Cleanup action |
|---|---|---|
| EC2 | Instance runtime and attached EBS | Stop when temporarily unused; terminate when finished |
| EBS | Volumes can persist after instances | Delete unneeded volumes and snapshots |
| Elastic IP | May incur cost when unattached | Release unused addresses |
| S3 | Storage, requests, and transfer | Empty and delete test buckets |
| Lambda | Requests and duration | Remove test functions and triggers |
| RDS | Instance runtime, storage, backups | Delete test databases and snapshots deliberately |
| ELB | Load balancer runtime and processed traffic | Delete listeners, target groups, and load balancers |
| ECS | Fargate or EC2 capacity, logs, and transfer | Delete services, tasks, clusters, and log groups |

## Workflow

```text
Provision -> Use -> Monitor -> Validate -> Clean up
```

Before `terraform apply`, verify the region, instance type, expected resources, and account budget. Never run `destroy` against resources outside this implementation.
