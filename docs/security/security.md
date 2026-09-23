# Security

## Status

Status: `DOCUMENTED`

No credentials, private keys, Terraform state, or real environment files are committed. This document describes the controls required before execution.

## Secrets and credentials

- Keep `.env` files local and use placeholders in `.env.example`.
- Use AWS SDK credential resolution, profiles, or IAM roles; never hard-code access keys.
- Keep SSH private keys outside the repository with restrictive filesystem permissions.
- Treat `GEMINI_API_KEY` and `MONGO_URI` as secrets.
- Rotate exposed credentials immediately and audit Git history if a secret is discovered.

## AWS and network access

Use least-privilege IAM permissions. Restrict SSH to an administrative source, expose only required HTTP/HTTPS ports, and never expose MongoDB publicly without a verified architecture requirement.

## Storage and databases

S3 designs should use Block Public Access, encryption, versioning where useful, and lifecycle rules. RDS is not a replacement for GyneCare's MongoDB. MongoDB access should use authenticated, encrypted connections and network restrictions.

## Terraform

Terraform state can contain infrastructure identifiers and sensitive values. Local state, `.terraform/`, variable files, and crash logs are ignored. Production teams should use encrypted remote state with locking.

## Docker

The Python demo uses a non-root runtime user. Images should be rebuilt from trusted base images, dependencies should be pinned where practical, and secrets must be supplied at runtime rather than copied into images.

## Validation checklist

- [ ] Secret-pattern scan completed
- [ ] `.env` files ignored
- [ ] No private keys tracked
- [ ] Terraform state ignored
- [ ] Security groups reviewed
- [ ] IAM permissions minimized
- [ ] Cloud resources cleaned up after testing
