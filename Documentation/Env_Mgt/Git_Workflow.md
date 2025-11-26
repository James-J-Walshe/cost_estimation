# Git Workflow Setup for Cost Estimation Tool

## Overview
This guide establishes a robust development workflow to prevent bugs from reaching production and enables proper testing before deployment.

## Branch Strategy

### Main Branches
- **`main`** - Production branch (GitHub Pages deployment)
- **`develop`** - Development integration branch
- **`feature/*`** - Feature development branches

### Workflow Steps

#### 1. Initial Setup
```bash
# Clone your repository
git clone https://github.com/James-J-Walshe/cost_estimation.git
cd cost_estimation

# Create and switch to develop branch
git checkout -b develop
git push -u origin develop

# Set develop as default branch for PRs in GitHub settings
```

#### 2. Feature Development
```bash
# Start new feature from develop
git checkout develop
git pull origin develop
git checkout -b feature/edit-functionality

# Work on your feature...
# Make commits as you progress
git add .
git commit -m "feat: add edit button functionality"
git commit -m "feat: implement inline editing for internal resources"
git commit -m "fix: resolve navigation conflicts with edit manager"

# Push feature branch
git push -u origin feature/edit-functionality
```

#### 3. Testing Environment Setup

Create a **testing environment** separate from production:

**Option A: GitHub Pages with develop branch**
1. Go to repository Settings → Pages
2. Create a second GitHub Pages site using the `develop` branch
3. Access testing version at: `https://james-j-walshe.github.io/cost_estimation-dev/`

**Option B: Local testing server**
```bash
# Install a simple HTTP server
npm install -g http-server
# or
pip install http-server

# Navigate to project directory and start server
cd cost_estimation
http-server -p 3000

# Test at: http://localhost:3000
```

#### 4. Pull Request Process
1. Create PR from `feature/edit-functionality` → `develop`
2. Test thoroughly in development environment
3. Review code changes
4. Merge to `develop` after testing
5. Test integrated features in develop environment
6. Create PR from `develop` → `main` for production deployment

## GitHub Actions for Automated Testing

Create `.github/workflows/test.yml`:

```yaml
name: Test and Validate

on:
  pull_request:
    branches: [ develop, main ]
  push:
    branches: [ develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: |
        npm install -g html-validate
        npm install -g jshint
    
    - name: Validate HTML
      run: html-validate index.html
    
    - name: Lint JavaScript
      run: |
        jshint script.js || true
        jshint modules/*.js || true
    
    - name: Check CSS
      run: |
        # Add CSS validation if needed
        echo "CSS validation placeholder"
    
    - name: Deploy to test environment
      if: github.ref == 'refs/heads/develop'
      run: |
        echo "Deploy to testing environment"
        # Add deployment steps for develop branch
```

## Production Deployment Protection

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
```

## Safe Rollback Strategy

### Quick Rollback Process
```bash
# If you need to rollback main to previous version
git checkout main
git log --oneline -5  # Find the commit to rollback to
git revert <commit-hash>  # Safer than reset for public repos
git push origin main

# Or reset to specific commit (use with caution)
git reset --hard <commit-hash>
git push --force-with-lease origin main
```

### Version Tagging
```bash
# Tag releases for easy rollback reference
git checkout main
git tag -a v1.0.0 -m "Release version 1.0.0 - Basic functionality"
git push origin v1.0.0

# Rollback to specific version if needed
git checkout v1.0.0
git checkout -b hotfix/rollback-v1.0.0
git push origin hotfix/rollback-v1.0.0
# Then create PR to main
```

## Development Best Practices

### 1. Commit Message Convention
```
feat: add edit functionality for internal resources
fix: resolve navigation tab conflicts
docs: update README with new features
refactor: split editManager into separate module
style: update edit button styling
test: add validation for edit inputs
```

### 2. Pre-commit Checklist
- [ ] Test all functionality locally
- [ ] Check browser console for errors
- [ ] Verify responsive design on mobile
- [ ] Test data persistence (localStorage)
- [ ] Validate CSV export functionality
- [ ] Check all navigation tabs work correctly

### 3. Code Review Checklist
- [ ] No console.log statements in production code
- [ ] Proper error handling implemented
- [ ] Code follows existing patterns
- [ ] No breaking changes to existing functionality
- [ ] Documentation updated if needed

## Emergency Procedures

### If Production is Broken
1. **Immediate rollback**: Use revert or reset to last working commit
2. **Hotfix branch**: Create `hotfix/critical-bug` from main
3. **Fast-track testing**: Minimal testing for critical fixes
4. **Deploy hotfix**: Direct merge to main after minimal validation

### Monitoring Production
- Check GitHub Pages deployment status
- Monitor browser console for JavaScript errors
- Test critical user flows after each deployment
- Keep backup of working version locally

## Tools and Resources

### Useful Git Commands
```bash
# View commit history with graph
git log --oneline --graph --all

# Compare branches
git diff develop..main

# Stash changes temporarily
git stash save "work in progress"
git stash pop

# Cherry-pick specific commits
git cherry-pick <commit-hash>
```

### Development Tools
- **VS Code Extensions**: GitLens, HTML CSS Support, JavaScript (ES6) code snippets
- **Browser Dev Tools**: Chrome DevTools for testing
- **Git GUI**: GitHub Desktop or SourceTree for visual git management
- **Local Server**: Live Server extension for VS Code

This workflow will significantly reduce bugs reaching production while maintaining development velocity.
