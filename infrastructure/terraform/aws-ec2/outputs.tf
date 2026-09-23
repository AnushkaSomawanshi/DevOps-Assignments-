output "instance_id" {
  description = "EC2 instance ID."
  value       = aws_instance.gynecare.id
}

output "public_ip" {
  description = "Public IPv4 address assigned to the EC2 instance."
  value       = aws_instance.gynecare.public_ip
}

output "private_ip" {
  description = "Private IPv4 address assigned to the EC2 instance."
  value       = aws_instance.gynecare.private_ip
}

output "public_dns" {
  description = "Public DNS name assigned to the EC2 instance."
  value       = aws_instance.gynecare.public_dns
}

output "availability_zone" {
  description = "Availability zone containing the instance."
  value       = aws_instance.gynecare.availability_zone
}
