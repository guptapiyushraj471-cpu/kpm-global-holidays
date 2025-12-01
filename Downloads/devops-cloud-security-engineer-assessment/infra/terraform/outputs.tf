output "cluster_name" {
  value = module.eks.cluster_name
}
output "dynamo_table_name" {
  value = aws_dynamodb_table.todos.name
}
output "irsa_role_arn" {
  value = aws_iam_role.irsa_role.arn
}
