# LightningCSS Deployment Fix Guide

## 🚨 Problem: `Error: Cannot find module '../lightningcss.linux-x64-gnu.node'`

This error occurs when deploying from Windows to Linux servers due to platform-specific native binaries in Tailwind CSS v4.

## 🔧 Solutions (Try in Order)

### **Solution 1: Clean Install (Recommended)**
```bash
# Remove existing modules and reinstall
rm -rf node_modules package-lock.json .next
npm install
npm run build
```

### **Solution 2: Platform-Specific Install**
```bash
# For Linux deployment from Windows
npm install --platform=linux --arch=x64
npm run build
```

### **Solution 3: Use Deployment Script**
```bash
# Automated fix
npm run deploy-prep
```

### **Solution 4: Docker Build (Most Reliable)**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### **Solution 5: Vercel/Netlify (Automatic)**
These platforms handle native binaries automatically. Just deploy normally.

## 🎯 Platform-Specific Instructions

### **Vercel Deployment:**
```bash
# No special steps needed - Vercel handles this automatically
git push origin main
```

### **Railway Deployment:**
```bash
# Add this to railway.json
{
  "build": {
    "command": "npm install && npm run build"
  }
}
```

### **DigitalOcean/AWS/GCP:**
```bash
# On the server
git clone your-repo
cd your-repo
npm install --production
npm run build
npm start
```

### **Shared Hosting:**
```bash
# Build locally, upload dist files
npm run build
# Upload .next folder and required files
```

## 🔍 Why This Happens

1. **Native Binaries**: LightningCSS uses platform-specific compiled modules
2. **Cross-Platform**: Building on Windows creates Windows binaries
3. **Linux Servers**: Need Linux-specific binaries to run
4. **Solution**: Install dependencies on target platform or use Docker

## ✅ Prevention

1. **Use Docker** for consistent builds across platforms
2. **CI/CD Pipeline** that builds on target platform
3. **Platform-Agnostic CSS** with standard PostCSS (fallback included)

## 🚨 If Nothing Works

**Fallback to Standard Tailwind:**
```bash
# Downgrade to Tailwind CSS v3
npm uninstall tailwindcss @tailwindcss/postcss
npm install tailwindcss@3 postcss autoprefixer
```

Then update `tailwind.config.js` for v3 syntax.

## 📞 Quick Help Commands

```bash
# Check platform
node -e "console.log(process.platform, process.arch)"

# Test LightningCSS
node -e "try { require('lightningcss'); console.log('✅ LightningCSS works') } catch(e) { console.log('❌ LightningCSS failed:', e.message) }"

# Check Node modules
ls -la node_modules/lightningcss*/
```

## ✨ Your App is Fixed!

Once resolved, your AcademyPro app will build and deploy successfully with all Tailwind CSS v4 features working perfectly!
