# Environment Configuration Guide

## Which Environment File to Use?

### ✅ **Use `.env.local` for Development**

**File Priority in Next.js:**
1. `.env.local` (highest priority) ← **Use this one**
2. `.env.development` 
3. `.env`
4. `.env.example` (template only)

## Current Setup

### 📁 **`.env.local`** (Primary Development File)
- ✅ **Use this file** for local development
- ✅ Excluded from Git (secure)
- ✅ Properly configured with detailed comments
- ✅ Contains all necessary environment variables

### 📁 **`.env`** (Not Recommended)
- ❌ Don't use this file
- ❌ Can be accidentally committed to Git
- ❌ Lower priority than `.env.local`

### 📁 **`.env.local.example`** (Template)
- ℹ️ Template file for team members
- ℹ️ Safe to commit (no real secrets)
- ℹ️ Copy this to create your `.env.local`

## Environment Variables Explained

```bash
# Database Connection
MONGODB_URI=mongodb://localhost:27017/academypro
# Use this for local MongoDB installation

# JWT Authentication
JWT_SECRET=academy-pro-jwt-secret-development-key-2025
# Secret key for JWT token signing (change in production!)

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=academy-pro-nextauth-secret-development-2025

# Environment Mode
NODE_ENV=development
```

## For Different Environments

### 🖥️ **Development (Local)**
- File: `.env.local`
- Database: Local MongoDB
- URL: `http://localhost:3000`

### 🚀 **Production (Deployment)**
- File: Environment variables set in hosting platform
- Database: MongoDB Atlas or production MongoDB
- URL: Your actual domain
- **Important**: Use strong, unique secrets!

### 🧪 **Testing**
- File: `.env.test` or `.env.test.local`
- Database: Test database
- Isolated from development data

## Security Best Practices

### ✅ **Do:**
- Use `.env.local` for development
- Keep secrets out of version control
- Use strong, unique secrets in production
- Document environment variables needed

### ❌ **Don't:**
- Commit `.env.local` to Git
- Use default/example secrets in production
- Share environment files containing real secrets
- Use production credentials in development

## Quick Setup for New Team Members

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Update the values in `.env.local` with your local configuration

3. Start development:
   ```bash
   npm run dev
   ```

## Troubleshooting

### Environment Variables Not Loading?
1. Check file name is exactly `.env.local`
2. Restart development server after changes
3. Verify no syntax errors in env file
4. Check Next.js environment variable naming (must start with `NEXT_PUBLIC_` for client-side)

### Database Connection Issues?
1. Verify MongoDB is running locally
2. Check database name matches in connection string
3. Ensure no typos in `MONGODB_URI`
4. Test connection with MongoDB Compass or CLI

### Authentication Issues?
1. Verify `JWT_SECRET` is set and consistent
2. Check `NEXTAUTH_SECRET` is properly configured
3. Ensure secrets are not empty or default values

---

## Summary

**🎯 Use `.env.local` for all your development work!**

This file is properly configured, secure, and follows Next.js best practices.
