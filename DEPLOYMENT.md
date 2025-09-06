# GitHub Pages Deployment Guide

## Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com) and create a new repository
2. Name it `german-persona-generator` (or any name you prefer)
3. Make it **public** (required for free GitHub Pages)
4. Don't initialize with README (we'll push existing code)

## Step 2: Connect Local Project to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Make initial commit
git commit -m "Initial commit: German Persona Generator"

# Add GitHub repository as origin
git remote add origin https://github.com/YOURUSERNAME/german-persona-generator.git

# Push to GitHub
git push -u origin main
```

**Replace `YOURUSERNAME` with your actual GitHub username!**

## Step 3: Configure GitHub Secrets

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add these secrets:

### Required Secrets:
- `VITE_SUPABASE_URL`: `https://bbqtxcpqzsqvvsppmcyt.supabase.co`
- `VITE_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJicXR4Y3BxenNxdnZzcHBtY3l0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNDEzNTYsImV4cCI6MjA3MjcxNzM1Nn0QwEH42qg4j3piYcrDHWs8NynC1DOVjlrqukIip4Gt5w`
- `VITE_DESTATIS_API_KEY`: `9ce3ff1522b84af5bc2824dc6524b16d`

### Optional Secrets:
- `VITE_EUROSTAT_API_KEY`: (if you have one)

## Step 4: Enable GitHub Pages

1. Go to **Settings** → **Pages**
2. Under **Source**, select **GitHub Actions**
3. The workflow will automatically deploy on the next push

## Step 5: Update package.json homepage

In `package.json`, update the homepage URL:
```json
"homepage": "https://YOURUSERNAME.github.io/german-persona-generator/"
```

## Step 6: Deploy

```bash
# Make a change and push to trigger deployment
git add .
git commit -m "Configure GitHub Pages deployment"
git push origin main
```

## Step 7: Access Your App

After the GitHub Action completes (2-3 minutes):
- Your app will be available at: `https://YOURUSERNAME.github.io/german-persona-generator/`
- Check the **Actions** tab for deployment status

## Alternative: Manual Deployment with gh-pages

If you prefer manual deployment:

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Deploy manually
npm run deploy
```

## Troubleshooting

### Build Fails
- Check the **Actions** tab for error details
- Ensure all secrets are properly set
- Verify package.json has correct dependencies

### App Doesn't Load
- Check browser console for errors
- Verify the base path in vite.config.js
- Ensure HashRouter is used (not BrowserRouter)

### Supabase Connection Issues
- Verify secrets are correctly set
- Check Supabase dashboard for any issues
- Test locally first with `npm run build && npm run preview`

## Production Considerations

### Security
- Environment variables are handled securely via GitHub Secrets
- Supabase anon key is safe to expose (it's designed for client-side use)
- API keys are injected at build time

### Performance
- Code splitting is configured for optimal loading
- Static assets are optimized by Vite
- CDN delivery via GitHub Pages

### Updates
- Every push to `main` branch triggers automatic deployment
- Changes are live within 2-3 minutes
- Previous versions are automatically replaced

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the `public` folder with your domain
2. Configure DNS to point to `YOURUSERNAME.github.io`
3. Enable HTTPS in GitHub Pages settings

## Monitoring

- Check **Actions** tab for deployment history
- Monitor **Insights** → **Traffic** for usage statistics
- Use browser dev tools to check for errors

## Local Development vs Production

The app automatically detects the environment:
- **Development**: Uses localhost, hot reload
- **Production**: Uses GitHub Pages URL, optimized build

Both environments support:
- ✅ Supabase cloud storage
- ✅ Local storage fallback  
- ✅ All persona generation features
- ✅ Export/import functionality