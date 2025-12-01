## EKS & IRSA
This setup creates:
- VPC (2 AZs)  
- EKS cluster + managed node group  
- DynamoDB table for todos  
- IAM role with IRSA linked to Kubernetes service account `todo-sa`
