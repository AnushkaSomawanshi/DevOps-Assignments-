# Assignment 6 — Implementation Evidence Guide

This directory holds the verification artifacts and execution proof for **Assignment 6: Jenkins Integration with GitHub**.

## Required Evidence Checklist

1. **Jenkins Environment**: Terminal or browser capture showing Jenkins LTS running on `http://localhost:8080`.
2. **Git & GitHub Plugin Setup**: Screenshot of Jenkins Plugin Manager confirming Git and GitHub integration plugins active.
3. **Freestyle Job Configuration**: Screenshot of `GitHub-Jenkins-Demo` job SCM settings pointing to repository `https://github.com/AnushkaSomawanshi/DevOps-Assignments-.git` on branch `*/main`.
4. **Build Execution & Console Output**: Terminal capture of Jenkins Console Output demonstrating:
   - Git remote fetching and checkout of latest commit.
   - Files cloned into `/var/jenkins_home/workspace/GitHub-Jenkins-Demo`.
   - Build step verification passing.
5. **Declarative Pipeline**: Screenshot of Jenkins Pipeline stage view displaying green pass status for all defined stages (Checkout, Environment Audit, Dependencies, Build, Docker Check).

For the complete technical report, see [Assignment 6 Documentation](../../docs/assignment-6/assignment-6-documentation.md).
