terraform {
  required_version = ">= 1.2"

  backend "s3" {
    bucket = "your-terraform-state-bucket"        # <-- replace
    key    = "devops-assessment/terraform.tfstate"
    region = "us-west-2"                          # <-- replace to your AWS region
    encrypt = true
    dynamodb_table = "your-terraform-locks-table" # <-- replace
  }
}
