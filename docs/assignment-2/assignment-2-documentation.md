# Assignment 2 — Cloud Computing & AWS EC2 Virtual Machine Deployment

## 1. Assignment Title
**Hosting and Deploying the GyneCare Hospital Management Application on AWS EC2**

## 2. Aim
To explore cloud compute fundamentals, select, configure, provision, secure, connect to, and manage an Amazon Elastic Compute Cloud (EC2) virtual machine, and establish the operational lifecycle for hosting the GyneCare application.

## 3. Objectives
- Understand cloud infrastructure fundamentals: Regions, Availability Zones, AMIs, and Virtual Private Clouds (VPCs).
- Configure virtual network security boundaries using AWS Security Groups (inbound/outbound traffic rules).
- Establish secure terminal access using SSH key pairs without embedding credentials in the codebase.
- Deploy the GyneCare backend application on Ubuntu Linux running inside an EC2 instance.
- Validate application health via `GET /api/health` and verify remote accessibility.
- Implement cost-conscious operational lifecycle procedures: start, stop, monitor with CloudWatch, and terminate.

## 4. Learning Outcomes
- Understanding the difference between on-premises virtualization and cloud Infrastructure as a Service (IaaS).
- Selecting optimal compute instance families (e.g., `t2.micro` or `t3.micro` for general-purpose workloads).
- Configuring persistent Elastic Block Store (EBS) volumes with encryption.
- Diagnosing Linux runtime issues, environment variable resolution, and process management.
- Applying cloud cost management by preventing orphaned cloud resources.

## 5. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                       AWS Cloud (Region)                    │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │               Virtual Private Cloud (VPC)           │   │
│   │                                                     │   │
│   │   ┌─────────────────────────────────────────────┐   │   │
│   │   │             Public Subnet (AZ)              │   │   │
│   │   │                                             │   │   │
│   │   │     ┌───────────────────────────────────┐   │   │   │
│   │   │     │        Security Group             │   │   │   │
│   │   │     │  • SSH: Port 22 (Admin IP only)   │   │   │   │
│   │   │     │  • HTTP: Port 80 / 5000           │   │   │   │
│   │   │     │                                   │   │   │   │
│   │   │     │   ┌───────────────────────────┐   │   │   │   │
│   │   │     │   │   EC2 Instance (Linux)    │   │   │   │   │
│   │   │     │   │  • GyneCare Express API   │   │   │   │   │
│   │   │     │   │  • Node.js 20 Runtime     │   │   │   │   │
│   │   │     │   └─────────────┬─────────────┘   │   │   │   │
│   │   │     └─────────────────┼─────────────────┘   │   │   │
│   │   └───────────────────────┼─────────────────────┘   │   │
│   └───────────────────────────┼─────────────────────────┘   │
└───────────────────────────────┼─────────────────────────────┘
                                │ Internet Gateway
                                ▼
                       User / Client Traffic
```

## 6. Technology Stack
- **Cloud Provider**: Amazon Web Services (AWS)
- **Compute**: Amazon EC2 (`t2.micro` / `t3.micro`, Ubuntu 22.04 LTS AMI)
- **Storage**: General Purpose SSD (`gp3`) Elastic Block Store (EBS) with AES-256 encryption
- **Networking**: VPC, Public Subnet, Route Tables, Internet Gateway (IGW)
- **Security**: AWS Security Groups, RSA Key Pairs (`.pem`)
- **Monitoring**: AWS CloudWatch (CPUUtilization, NetworkIn/Out, StatusCheckFailed)

## 7. Implementation Workflow

### Step 1: Network & Security Boundary Setup
1. Identify or create a VPC with an attached Internet Gateway.
2. Create a Security Group `gynecare-ec2-sg` with specific rules:
   - Inbound SSH (Port 22) restricted to administrator IP (`<admin-ip>/32`).
   - Inbound HTTP (Port 80 / 5000) for application access.
   - Outbound all traffic (`0.0.0.0/0`) for package updates.

### Step 2: EC2 Instance Launch
1. Choose AMI: Ubuntu Server 22.04 LTS (x86_64).
2. Choose Instance Type: `t2.micro` (AWS Free Tier eligible: 1 vCPU, 1 GiB Memory).
3. Attach Key Pair: `gynecare-key.pem` (stored securely on local machine with `chmod 400`).
4. Configure 20 GiB `gp3` root volume with EBS encryption enabled.

### Step 3: Secure Remote Connection
```bash
# Set file permissions on local private key
chmod 400 gynecare-key.pem

# Connect to EC2 instance via SSH
ssh -i gynecare-key.pem ubuntu@<EC2_PUBLIC_IP>
```

### Step 4: Host Provisioning & Runtime Configuration
```bash
# Update system package index
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 and Git
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git

# Verify installation
node -v
npm -v
git --version
```

### Step 5: Application Deployment & Execution
```bash
# Clone GyneCare repository
git clone https://github.com/AnushkaSomawanshi/DevOps-Assignments-.git
cd DevOps-Assignments-/BOT-MERN-Gynecare-Hospital-Management-System-/server

# Install production dependencies
npm install --omit=dev

# Configure environment variables securely
cat << 'EOF' > .env
PORT=5000
MONGO_URI=mongodb://<database_host>:27017/hospitalDB
GEMINI_API_KEY=
EOF

# Start application server
node server.js
```

## 8. Verification & Operational Monitoring

### Health Endpoint Check
```bash
# Local check on instance
curl http://localhost:5000/api/health

# External check from administrative terminal
curl http://<EC2_PUBLIC_IP>:5000/api/health
```
**Expected Response:**
```json
{
  "ok": true,
  "status": "healthy",
  "service": "GyneCare Hospital Management API",
  "uptime": 45.12,
  "timestamp": "2026-09-27T15:25:24.878Z"
}
```

### CloudWatch Operational Metrics
- **CPUUtilization**: Expected baseline < 15% during standard API servicing.
- **StatusCheckFailed_System / StatusCheckFailed_Instance**: Must equal `0`.
- **NetworkIn / NetworkOut**: Observes data transfer rates.

## 9. Lifecycle Management & Resource Decommissioning
To adhere to FinOps and cloud hygiene best practices:
- **Stopping Instance**: When not in active testing, stop instance via `aws ec2 stop-instances` to halt hourly compute charges.
- **Terminating Instance**: Upon completing evaluation, terminate via `aws ec2 terminate-instances` to remove EBS volume and release public IP.

## 10. Conclusion
Assignment 2 demonstrates how GyneCare can be hosted on a cloud virtual machine. While manual provisioning provides clear visibility into virtual machine configuration, it highlights the need for declarative automation (IaC via Terraform) and container portability (Docker), which are addressed in Assignments 3, 4, and 5.
