variable "aws_region" {
  description = "AWS region where the EC2 instance will be created."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name used in resource names and tags."
  type        = string
  default     = "gynecare"
}

variable "environment" {
  description = "Deployment environment name."
  type        = string
  default     = "dev"
}

variable "ami_id" {
  description = "A verified Linux AMI ID for the selected AWS region."
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type."
  type        = string
  default     = "t3.micro"
}

variable "key_name" {
  description = "Existing EC2 key pair name; the private key must remain outside Git."
  type        = string
}

variable "subnet_id" {
  description = "Existing subnet ID in the default VPC."
  type        = string
}

variable "ssh_cidr_blocks" {
  description = "CIDR blocks allowed to connect over SSH. Restrict to an administrator IP."
  type        = list(string)
}

variable "root_volume_size" {
  description = "Encrypted root EBS volume size in GiB."
  type        = number
  default     = 20
}
