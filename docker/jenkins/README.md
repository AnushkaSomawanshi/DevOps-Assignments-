# Jenkins Automation Server Environment

This directory provides a containerized **Jenkins LTS** environment for automating CI/CD workflows and executing GitHub integration tasks for the **GyneCare Hospital Management System**.

## Quick Start

```bash
# 1. Start Jenkins container
docker compose up -d

# 2. View initial setup password
docker compose logs jenkins | grep -A 2 "Please use the following password"

# 3. Access Jenkins Web Console
# Open browser at: http://localhost:8080
```

## Configuration for Assignment 6

1. **Install Recommended Plugins**: Ensure **Git Plugin**, **GitHub Plugin**, and **Pipeline** are installed.
2. **Freestyle Project**: Create job `GitHub-Jenkins-Demo`, configure Source Code Management to point to `https://github.com/AnushkaSomawanshi/DevOps-Assignments-.git` on branch `*/main`.
3. **Pipeline Project**: Create pipeline pointing to the root [`Jenkinsfile`](../../Jenkinsfile).

For complete technical documentation, refer to [Assignment 6 Documentation](../../docs/assignment-6/assignment-6-documentation.md).
