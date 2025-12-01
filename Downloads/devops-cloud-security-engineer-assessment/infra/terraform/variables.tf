variable "aws_region" {
  type    = string
  default = "us-west-2"
  description = "AWS region for infra"
}

variable "state_bucket" {
  type = string
  default = "your-terraform-state-bucket"
}
