# Assignment 6 — Jenkins Integration with GitHub & CI Automation

## 1. Assignment Title
**Assignment No. 6: Jenkins Integration with a Git Repository and Automating Source Code Retrieval from GitHub**

## 2. Aim
To configure the Jenkins Continuous Integration automation server with the official GyneCare GitHub repository, automate source code retrieval upon build initiation, and implement automated build and verification stages using both Freestyle and Declarative Pipeline workflows.

## 3. Objectives
- Understand the role of Jenkins and Continuous Integration (CI) in modern DevOps lifecycles.
- Establish a reproducible, containerized Jenkins LTS server environment using Docker Compose.
- Configure Jenkins Git and GitHub plugins with appropriate repository authentication.
- Create and configure a Jenkins **Freestyle Project** (`GitHub-Jenkins-Demo`) to automate Git checkout from branch `main` and execute project verification.
- Author a modular, declarative **Jenkins Pipeline** (`Jenkinsfile`) with distinct stages: Checkout, Environment Audit, Install Dependencies, Build & Typecheck, and Container Specification Validation.
- Document operational console logs, workspace mechanics, credential protection, and webhook automation strategies.

## 4. Learning Outcomes
- Understanding the Jenkins distributed architecture: Controller (master) scheduling and Agent (executor) execution.
- Mastery of Source Code Management (SCM) integration, branch targeting, and commit tracking.
- Distinguishing between graphical Freestyle projects and version-controlled Pipeline-as-Code (`Jenkinsfile`).
- Configuring automated workspace management and error handling across build stages.
- Diagnosing authentication bottlenecks, network timeouts, and tool path discrepancies in automated build runners.

## 5. Continuous Integration & Jenkins Fundamentals
Continuous Integration (CI) is a software engineering practice where developers frequently commit code changes to a central repository (such as GitHub), triggering automated builds and tests to identify regression defects early.

### Jenkins Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Jenkins Controller (Master)                     │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                     Web UI & REST API Engine                   │   │
│   └───────────────────────────────┬────────────────────────────────┘   │
│                                   │                                    │
│   ┌────────────────────┐          │          ┌─────────────────────┐   │
│   │   Plugin Manager   │          │          │   Build Scheduler   │   │
│   │ (Git, GitHub, Pipe)│          │          │  & Security Engine  │   │
│   └────────────────────┘          │          └─────────────────────┘   │
│                                   │                                    │
│                     Work Assignment over Remoting/SSH                  │
└───────────────────────────────────┼────────────────────────────────────┘
                                    │
          ┌─────────────────────────┴─────────────────────────┐
          ▼                                                   ▼
┌───────────────────────────────┐               ┌───────────────────────────────┐
│     Jenkins Local Executor    │               │     Jenkins Agent Container   │
│  • Workspace: /var/jenkins_home│              │  • Dynamic ephemeral executor │
│  • Git checkout & compilation │               │  • Isolated build sandbox     │
└───────────────────────────────┘               └───────────────────────────────┘
```

- **Controller**: Manages user interfaces, stores job configurations, manages credentials, and dispatches builds.
- **Agent (Node)**: Executes tasks dispatched by the controller within dedicated filesystem workspaces.
- **Workspace**: The physical directory created on the agent where source code is cloned and built (`/var/jenkins_home/workspace/<job-name>`).

## 6. GyneCare Repository Context in CI
The automated pipeline targets the official GyneCare repository:
- **Repository URL**: `https://github.com/AnushkaSomawanshi/DevOps-Assignments-.git`
- **Target Branch**: `*/main`
- **Application Stack**: React 19 Frontend (`client/`), Express.js API Backend (`server/`), MongoDB schemas, Docker container specifications.

## 7. Laboratory Environment Setup: Jenkins in Docker
To ensure a reproducible environment, Jenkins LTS is containerized using [`docker/jenkins/compose.yaml`](../../docker/jenkins/compose.yaml):

```yaml
services:
  jenkins:
    image: jenkins/jenkins:lts-jdk17
    container_name: gynecare-jenkins
    restart: unless-stopped
    ports:
      - "8080:8080"
      - "50000:50000"
    volumes:
      - jenkins_home:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock
    networks:
      - jenkins-network

volumes:
  jenkins_home:
    name: gynecare_jenkins_home
```

### Launch Command
```bash
cd docker/jenkins
docker compose up -d
```
Upon startup, the administrator logs in at `http://localhost:8080` using the initial setup password retrieved via `docker logs gynecare-jenkins`.

## 8. Implementation 1: Freestyle Project (`GitHub-Jenkins-Demo`)

### Project Workflow
```
Developer Commit ──> GitHub Repo ──> Jenkins SCM Checkout ──> Build Step (Audit & Test) ──> Console Output
```

### Step-by-Step Configuration
1. **Create Item**: Navigate to Jenkins Dashboard -> **New Item** -> Enter `GitHub-Jenkins-Demo` -> Select **Freestyle project** -> Click **OK**.
2. **General**: Add project description: `Automated GitHub source code checkout and build validation for GyneCare Hospital Management System`.
3. **Source Code Management (SCM)**:
   - Select **Git**.
   - **Repository URL**: `https://github.com/AnushkaSomawanshi/DevOps-Assignments-.git`
   - **Credentials**: None required for public repositories; Personal Access Token (PAT) configured for private repos.
   - **Branches to build**: `*/main`
4. **Build Triggers**:
   - Optional: Select *Poll SCM* (`H/5 * * * *`) or *GitHub hook trigger for GITScm polling*.
5. **Build Environment**: Select *Delete workspace before build starts* and *Add timestamps to the Console Output*.
6. **Build Steps**: Add **Execute shell** (or **Execute Windows batch command**):
   ```bash
   echo "=== GyneCare Automated Build Verification ==="
   echo "Workspace Directory: $WORKSPACE"
   echo "Current Commit: $GIT_COMMIT"
   echo "Branch: $GIT_BRANCH"

   # Verify repository files
   ls -la

   # Verify application manifests
   test -f server/package.json && echo "Backend package verified."
   test -f client/package.json && echo "Frontend package verified."
   test -f compose.yaml && echo "Docker Compose specification verified."
   ```
7. **Post-build Actions**: Configure *Archive the artifacts* or console email alerts.
8. **Execution**: Click **Save**, then click **Build Now**.

### Freestyle Console Output (Simulation / Expected Verification)
```text
Started by user admin
Running as SYSTEM
Building in workspace /var/jenkins_home/workspace/GitHub-Jenkins-Demo
The recommended git tool is: NONE
using credential github-auth
 > git rev-parse --resolve-git-dir /var/jenkins_home/workspace/GitHub-Jenkins-Demo/.git # timeout=10
Fetching changes from the remote Git repository
 > git config remote.origin.url https://github.com/AnushkaSomawanshi/DevOps-Assignments-.git # timeout=10
Fetching upstream changes from https://github.com/AnushkaSomawanshi/DevOps-Assignments-.git
 > git --version # timeout=10
 > git fetch --tags --force --progress -- https://github.com/AnushkaSomawanshi/DevOps-Assignments-.git +refs/heads/*:refs/remotes/origin/* # timeout=10
 > git rev-parse refs/remotes/origin/main^{commit} # timeout=10
Checking out Revision 78430d7 (refs/remotes/origin/main)
 > git config core.sparsecheckout # timeout=10
 > git checkout -f 78430d7
Commit message: "feat: complete docker and docker compose multi-container implementation and documentation"
[GitHub-Jenkins-Demo] $ /bin/sh -xe /tmp/jenkins159048301.sh
+ echo === GyneCare Automated Build Verification ===
=== GyneCare Automated Build Verification ===
+ echo Workspace Directory: /var/jenkins_home/workspace/GitHub-Jenkins-Demo
Workspace Directory: /var/jenkins_home/workspace/GitHub-Jenkins-Demo
+ test -f server/package.json
+ echo Backend package verified.
Backend package verified.
+ test -f client/package.json
+ echo Frontend package verified.
Frontend package verified.
+ test -f compose.yaml
+ echo Docker Compose specification verified.
Docker Compose specification verified.
Finished: SUCCESS
```

## 9. Implementation 2: Declarative Pipeline (`Jenkinsfile`)
Modern enterprise CI/CD utilizes **Pipeline as Code**, version-controlled within the repository itself via [`Jenkinsfile`](../../Jenkinsfile).

### Pipeline Stage Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           GyneCare Declarative CI                           │
│                                                                             │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐  │
│  │   Stage 1    │   │   Stage 2    │   │   Stage 3    │   │   Stage 4    │  │
│  │   Checkout   │──>│ Environment  │──>│ Dependencies │──>│ Build & Type │──│
│  │ (GitHub SCM) │   │    Audit     │   │ (npm install)│   │  (tsc/vite)  │  │
│  └──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘  │
│                                                                   │         │
│                                                                   ▼         │
│  ┌──────────────┐                                         ┌──────────────┐  │
│  │ Post Actions │<────────────────────────────────────────│   Stage 5    │  │
│  │(Success/Fail)│                                         │ Docker Check │  │
│  └──────────────┘                                         │(compose.yaml)│  │
│                                                           └──────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Jenkinsfile Structure & Detailed Explanation
- **`agent any`**: Allocates any available Jenkins agent to execute the pipeline.
- **`options`**: Enforces build constraints: 20-minute timeout, timestamp logs, terminal colorization, and prevents concurrent runs.
- **`stage('Checkout')`**: Uses `checkout scmGit` to clone `https://github.com/AnushkaSomawanshi/DevOps-Assignments-.git` on branch `*/main`.
- **`stage('Environment Audit')`**: Logs active tool versions (`git`, `node`, `npm`, `docker`).
- **`stage('Install Dependencies')`**: Installs clean production dependencies in `server/` and `client/`.
- **`stage('Build & Typecheck')`**: Runs `npm --prefix client run typecheck` to validate TypeScript interfaces, followed by `npm --prefix client run build` to compile the production Vite bundle.
- **`stage('Docker & Compose Validation')`**: Validates the presence of `Dockerfile` and tests `compose.yaml` syntax via `docker compose config`.
- **`post`**: Emits execution summaries based on build outcome (`success` or `failure`).

## 10. Webhooks vs. Polling SCM
Two triggering models connect GitHub to Jenkins:

| Attribute | Polling SCM (`Poll SCM`) | GitHub Webhook (`push`) |
|---|---|---|
| **Mechanism** | Jenkins periodically queries GitHub API for commit changes | GitHub actively pushes an HTTP POST payload to Jenkins on push |
| **Network Requirement** | Outbound internet access from Jenkins to GitHub | Inbound connectivity from GitHub to Jenkins URL (`http://<domain>/github-webhook/`) |
| **Resource Usage** | Higher (constant polling requests even when idle) | Near zero (instant push notification only on new commits) |
| **Latency** | Delay equal to poll interval (e.g., 5 minutes) | Sub-second real-time build initiation |
| **Local Verification** | Works easily behind NAT/firewall without public IP | Requires public tunnel (e.g., ngrok) for local Docker Desktop testing |

## 11. Security & Credential Management
1. **Secret Masking**: Jenkins automatically masks configured credentials with `****` in console logs.
2. **Access Tokens**: Integration with private GitHub repositories uses Personal Access Tokens (PATs) with fine-grained `repo:read` scopes instead of plain account passwords.
3. **RBAC**: Jenkins Role-Based Access Control limits job editing to authenticated developers while granting read-only access to automated observers.

## 12. Troubleshooting Guide

| Issue | Cause | Solution |
|---|---|---|
| `Host key verification failed` | Missing GitHub SSH fingerprint | Add `github.com` to agent's `known_hosts` or use HTTPS repository URL |
| `HTTP 401 / 403 Unauthorized` | Invalid or expired GitHub token | Regenerate GitHub PAT under Settings -> Developer Settings and update Jenkins Credentials |
| `Git plugin not found` | Plugin missing in Jenkins installation | Install **Git Plugin** under Manage Jenkins -> Plugins -> Available Plugins |
| Build fails during `npm install` | Memory limit on agent container | Allocate at least 2 GiB RAM to Jenkins runner container |
| Webhook does not trigger build | Localhost not reachable from GitHub | Verify URL via public tunnel or use Polling SCM for local evaluation |

## 13. DevOps Relevance
Continuous Integration ensures that the GyneCare codebase remains in a perpetually releasable state. By automating Git checkouts and pipeline verification:
- Breaking frontend changes or missing dependencies are caught within minutes of a `git push`.
- Docker Compose specifications are checked before deployment to staging or production.
- Manual human errors in pulling code or running tests are eliminated.

## 14. Results
- Configured Jenkins Docker Compose environment ready for deployment.
- Freestyle job `GitHub-Jenkins-Demo` designed and documented with exact SCM parameters.
- Production-grade declarative `Jenkinsfile` created in the root repository.
- Complete execution procedures and console logs documented.

## 15. Limitations & Environment Status
- **Local Network Limitation**: Automated GitHub webhooks require a publicly reachable domain or tunnel. When evaluating locally without a tunnel, SCM Polling (`H/5 * * * *`) or manual "Build Now" triggers are utilized.
- **Tooling Execution**: When running in containerized agents, the runner must either have Node.js pre-installed or mount the host engine.

## 16. Evidence / Screenshot Guide

| Item | Title | Purpose | Command / Action | What It Proves |
|---|---|---|---|---|
| **Screenshot 1** | Jenkins Dashboard | Verify Jenkins server readiness | Open `http://localhost:8080` | Confirms active Jenkins controller |
| **Screenshot 2** | Git Plugin Installation | Validate plugin setup | Manage Jenkins -> Plugins -> Installed | Confirms Git & GitHub plugins active |
| **Screenshot 3** | Freestyle Job SCM Config | Validate repository configuration | Job Configure -> Source Code Management | Confirms target URL and branch `*/main` |
| **Screenshot 4** | Build Execution | Trigger automated build | Click "Build Now" | Confirms job queue and execution start |
| **Screenshot 5** | Console Output | Validate Git checkout | Click Build # -> Console Output | Proves code cloned into `/var/jenkins_home/workspace` |
| **Screenshot 6** | Pipeline Visualization | Pipeline stage status | Open Pipeline View | Proves multi-stage `Jenkinsfile` pass |

## 17. Requirement Traceability Matrix

| Requirement | Implementation Artifact | Operational Action | Status |
|---|---|---|---|
| Jenkins Environment | `docker/jenkins/compose.yaml` | `docker compose up -d` | Implemented |
| Git Integration | SCM Configuration | URL: `https://github.com/AnushkaSomawanshi/DevOps-Assignments-.git` | Implemented |
| Freestyle Job | Job: `GitHub-Jenkins-Demo` | Automated checkout & shell verification | Implemented & Documented |
| Branch Configuration | Branch: `*/main` | Specified in job SCM & Jenkinsfile | Implemented |
| Declarative Pipeline | `Jenkinsfile` | 5-stage declarative pipeline | Implemented |
| Security Best Practices | Secret masking & PATs | Zero credentials committed | Verified |

## 18. Conclusion
Assignment 6 successfully bridges source control with continuous integration. By configuring Jenkins to automate code retrieval from the official GyneCare GitHub repository and establishing a declarative pipeline, the foundation is laid for automated containerization and Kubernetes deployments in subsequent assignments.
