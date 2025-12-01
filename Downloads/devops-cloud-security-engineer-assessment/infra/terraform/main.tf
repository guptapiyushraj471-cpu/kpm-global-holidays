provider "aws" {
  region = var.aws_region
}

data "aws_caller_identity" "current" {}

# --- VPC ---
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.1.2"

  name = "assessment-vpc"
  cidr = "10.0.0.0/16"
  azs             = ["${var.aws_region}a", "${var.aws_region}b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.3.0/24", "10.0.4.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = true

  tags = {
    Name = "assessment-vpc"
  }
}

# --- EKS Cluster ---
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "20.8.4"

  cluster_name    = "assessment-eks"
  cluster_version = "1.30"
  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.private_subnets

  eks_managed_node_groups = {
    default = {
      min_size     = 1
      max_size     = 2
      desired_size = 1
      instance_types = ["t3.medium"]
    }
  }

  tags = {
    Environment = "assessment"
  }
}

# --- DynamoDB Table for Todos ---
resource "aws_dynamodb_table" "todos" {
  name           = "todos"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    Name = "todos-table"
  }
}

# --- IAM Role for Service Account (IRSA) ---
data "aws_iam_policy_document" "dynamo_access" {
  statement {
    effect = "Allow"
    actions = [
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem",
      "dynamodb:Scan"
    ]
    resources = [aws_dynamodb_table.todos.arn]
  }
}

resource "aws_iam_policy" "dynamo_policy" {
  name        = "eks-dynamo-policy"
  description = "Access to DynamoDB todos table"
  policy      = data.aws_iam_policy_document.dynamo_access.json
}

resource "aws_iam_role" "irsa_role" {
  name = "eks-irsa-dynamo-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Federated = module.eks.oidc_provider_arn
      }
      Action = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringEquals = {
          "${replace(module.eks.cluster_oidc_issuer_url, "https://", "")}:sub" = "system:serviceaccount:default:todo-sa"
        }
      }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "irsa_attach" {
  role       = aws_iam_role.irsa_role.name
  policy_arn = aws_iam_policy.dynamo_policy.arn
}
