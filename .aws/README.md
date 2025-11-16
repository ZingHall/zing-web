# AWS ECS Task Definitions

This directory contains ECS task definitions for deploying zing-web to different environments.

## Files

- `task-definition-staging.json` - Staging environment configuration
- `task-definition-production.json` - Production environment configuration

## Configuration

### Staging
- **CPU**: 256 (.25 vCPU)
- **Memory**: 512 MB
- **Container Port**: 3000
- **Environment**: staging

### Production
- **CPU**: 512 (.5 vCPU)
- **Memory**: 1024 MB (1 GB)
- **Container Port**: 3000
- **Environment**: production

## Setup Required

Before deploying, update the following placeholders in both files:

1. Replace `AWS_ACCOUNT_ID` with your actual AWS account ID in:
   - `executionRoleArn`
   - `taskRoleArn`
   - `image` URL

2. Ensure the following IAM roles exist:
   - `ecsTaskExecutionRole` - For ECS to pull images and write logs
   - `ecsTaskRole` - For the container to access AWS services

3. Create CloudWatch Log Group:
   ```bash
   aws logs create-log-group --log-group-name /ecs/zing-web
   ```

## Adding Secrets

To add secrets from AWS Systems Manager Parameter Store or Secrets Manager:

```json
"secrets": [
  {
    "name": "DATABASE_URL",
    "valueFrom": "arn:aws:secretsmanager:ap-northeast-1:AWS_ACCOUNT_ID:secret:zing-web/staging/database-url"
  }
]
```

## Health Check

The task definitions include a health check that:
- Checks `http://localhost:3000/` every 30 seconds
- Allows 60 seconds for initial startup
- Requires 3 successful checks to mark as healthy
- Times out after 5 seconds per check

## Logging

Logs are sent to CloudWatch Logs:
- **Log Group**: `/ecs/zing-web` (shared across environments)

## Usage

These files are automatically used by GitHub Actions workflows:
- `.github/workflows/deploy-staging.yml`
- `.github/workflows/deploy-production.yml`

The workflows will:
1. Build Docker image
2. Push to ECR
3. Update task definition with new image
4. Deploy to ECS

## Customization

Adjust CPU/Memory based on your application needs:

| CPU  | Memory Options (MB)           |
|------|-------------------------------|
| 256  | 512, 1024, 2048              |
| 512  | 1024, 2048, 3072, 4096       |
| 1024 | 2048, 3072, 4096, 5120, 6144, 7168, 8192 |
| 2048 | 4096 - 16384 (1 GB increments)|
| 4096 | 8192 - 30720 (1 GB increments)|

## Environment Variables

Add application-specific environment variables to the `environment` array:

```json
"environment": [
  {
    "name": "NEXT_PUBLIC_API_URL",
    "value": "https://api.staging.zing.example.com"
  }
]
```

For sensitive values, use the `secrets` array instead.
