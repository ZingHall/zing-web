# CI/CD for Zing Web

This directory contains GitHub Actions workflows for the Zing Web application.

## Workflows

### 1. Lint, Test, and Build (`lint-test-build.yml`)

**Triggers:**
- Push to any branch
- Pull requests to `main` or `develop`

**Purpose:** Continuous integration checks for code quality

**Steps:**
1. Checkout code
2. Setup Node.js 20
3. Install dependencies
4. Run ESLint
5. Run TypeScript type checking
6. Build Next.js application
7. Upload build artifacts

### 2. Deploy to Staging (`deploy-staging.yml`)

**Triggers:**
- Push to `main` branch (automatic on merge)

**Environment:** staging

**Required Secrets:**
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_REGION` - AWS region (e.g., us-east-1)
- `S3_BUCKET` - S3 bucket name for static files
- `CLOUDFRONT_DISTRIBUTION_ID` - CloudFront distribution ID

**Steps:**
1. Checkout code
2. Setup Node.js 20
3. Install dependencies
4. Run linting and type checking
5. Build Next.js application
6. Configure AWS credentials
7. Deploy static files to S3
8. Invalidate CloudFront cache

### 3. Deploy to Production (`deploy-production.yml`)

**Triggers:**
- Manual trigger only via GitHub Actions UI (`workflow_dispatch`)
- Requires typing "deploy" to confirm

**Environment:** production

**Required Secrets:**
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_REGION` - AWS region (e.g., us-east-1)
- `S3_BUCKET` - S3 bucket name for static files
- `CLOUDFRONT_DISTRIBUTION_ID` - CloudFront distribution ID

**Steps:**
1. Validate confirmation input
2. Checkout code
3. Setup Node.js 20
4. Install dependencies
5. Run linting and type checking
6. Build Next.js application
7. Configure AWS credentials
8. Deploy static files to S3
9. Invalidate CloudFront cache

## Setup Instructions

### 1. Configure GitHub Environments

Create two environments in your repository:

**Staging Environment:**
1. Go to Repository Settings > Environments
2. Click "New environment"
3. Name: `staging`
4. (Optional) Add deployment branch restriction to `main`

**Production Environment:**
1. Go to Repository Settings > Environments
2. Click "New environment"
3. Name: `production`
4. Enable "Required reviewers" and add team members
5. (Optional) Enable "Wait timer" for deployment delay
6. Restrict deployment branches to `main` only

### 2. Add Secrets

Add the following secrets to each environment:

**For Staging Environment:**
1. Settings > Environments > staging > Add secret
2. Add each of these secrets:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION` (e.g., `us-east-1`)
   - `S3_BUCKET` (staging bucket name)
   - `CLOUDFRONT_DISTRIBUTION_ID` (staging distribution)

**For Production Environment:**
1. Settings > Environments > production > Add secret
2. Add each of these secrets:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_REGION` (e.g., `us-east-1`)
   - `S3_BUCKET` (production bucket name)
   - `CLOUDFRONT_DISTRIBUTION_ID` (production distribution)

### 3. AWS Setup

Ensure the following AWS resources are configured:

1. **S3 Buckets:**
   - Staging: `zing-web-staging` (or your chosen name)
   - Production: `zing-web-production` (or your chosen name)
   - Enable static website hosting
   - Configure appropriate bucket policies

2. **CloudFront Distributions:**
   - Create distributions pointing to S3 buckets
   - Configure origin access identity
   - Set up custom domain names (optional)

3. **IAM User/Role:**
   - Create IAM user with programmatic access
   - Attach policy with permissions:
     - S3: `s3:PutObject`, `s3:DeleteObject`, `s3:ListBucket`, `s3:Sync`
     - CloudFront: `cloudfront:CreateInvalidation`

## Workflow Process

### Development Flow

```
Feature branch → PR → CI checks (lint-test-build)
    ↓
Merge to main
    ↓
Auto-deploy to staging
    ↓
Test in staging
    ↓
Manual production deployment (with confirmation)
```

### CI Checks (All Branches)

```
Push to any branch
    ↓
Run lint-test-build workflow
    ↓
- ESLint checks
- TypeScript type checking
- Next.js build
    ↓
Pass/Fail status on commit
```

### Staging Deployment

```
Merge to main branch
    ↓
Auto-trigger staging deployment
    ↓
Build and deploy to S3
    ↓
Invalidate CloudFront cache
    ↓
Staging environment updated
```

### Production Deployment

```
Manual trigger from Actions tab
    ↓
Type "deploy" to confirm
    ↓
(Optional) Wait for reviewer approval
    ↓
Build and deploy to S3
    ↓
Invalidate CloudFront cache
    ↓
Production environment updated
```

## Manual Deployment

To deploy to production:

1. Go to Actions tab in GitHub
2. Select "Deploy to Production"
3. Click "Run workflow"
4. In the "confirm" field, type: `deploy`
5. Click "Run workflow" to start

## Best Practices

1. **Always test in staging first**
   - Merge to `main` triggers automatic staging deployment
   - Verify functionality in staging before production
   - Check CloudFront distribution and S3 bucket

2. **Use Pull Requests**
   - Create PRs for all changes
   - CI checks run automatically
   - Require approval before merging
   - Squash commits for clean history

3. **Monitor deployments**
   - Check GitHub Actions logs
   - Verify CloudFront invalidation completes
   - Test application functionality
   - Monitor AWS CloudWatch metrics

4. **Rollback strategy**
   - Keep previous builds in S3 with versioning
   - Document deployment steps
   - Have rollback procedure ready

## Troubleshooting

### CI checks failing

1. Check GitHub Actions logs
2. Run locally: `yarn lint && yarn tsc --noEmit && yarn build`
3. Fix issues and push again

### Staging deployment fails

1. Check GitHub Actions logs
2. Verify AWS credentials are correct
3. Check S3 bucket permissions
4. Verify CloudFront distribution ID
5. Test AWS CLI access locally

### Production deployment fails

1. Check GitHub Actions logs
2. Verify production environment secrets
3. Ensure confirmation was typed correctly
4. Check S3 bucket and CloudFront settings
5. Review IAM permissions

### CloudFront cache not clearing

1. Check invalidation status in AWS Console
2. Verify distribution ID is correct
3. Ensure IAM user has `cloudfront:CreateInvalidation` permission
4. Wait for invalidation to complete (can take 5-15 minutes)

## Environment Variables

If your Next.js app requires runtime environment variables, add them to the build step:

```yaml
- name: Build application
  run: yarn build
  env:
    NODE_ENV: production
    NEXT_PUBLIC_API_URL: ${{ secrets.API_URL }}
    # Add other environment variables as needed
```

## Security Considerations

1. **Never commit AWS credentials**
2. **Use least-privilege IAM policies**
3. **Enable MFA for production deployments**
4. **Rotate AWS access keys regularly**
5. **Use environment-specific secrets**
6. **Enable CloudFront WAF for production**
7. **Monitor AWS CloudTrail logs**

## Monitoring

After deployment, verify:

1. ✅ Build completed successfully
2. ✅ S3 files uploaded correctly
3. ✅ CloudFront invalidation completed
4. ✅ Website loads correctly
5. ✅ All routes function properly
6. ✅ No console errors
7. ✅ Performance metrics acceptable

## Support

If you encounter issues:

1. Check GitHub Actions logs
2. Review AWS CloudWatch logs
3. Test AWS CLI commands locally
4. Contact DevOps team
5. Review Next.js build documentation
