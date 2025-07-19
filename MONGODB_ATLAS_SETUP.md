# MongoDB Atlas Setup Guide

## 🚀 Quick Setup for MongoDB Atlas

### Step 1: Create MongoDB Atlas Account
1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Sign up for a free account or login
3. Create a new project (name it "AcademyPro")

### Step 2: Create a Free Cluster
1. Click "Create" or "Build a Database"
2. Choose **FREE** tier (M0 Sandbox)
3. Select a cloud provider and region (choose closest to you)
4. Cluster name: `academypro-cluster`
5. Click "Create Cluster"

### Step 3: Create Database User
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Authentication Method: **Password**
4. Username: `academypro-admin`
5. Password: Click "Autogenerate Secure Password" (save this!)
6. Database User Privileges: **Read and write to any database**
7. Click "Add User"

### Step 4: Whitelist IP Address
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Choose **"Allow Access from Anywhere"** (0.0.0.0/0)
   - For development only. In production, use specific IPs
4. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Clusters" in left sidebar
2. Click "Connect" button on your cluster
3. Choose "Connect your application"
4. Driver: **Node.js**, Version: **5.5 or later**
5. Copy the connection string

### Step 6: Update Your .env.local
Replace the connection string in your `.env.local` file:

```bash
MONGODB_URI=mongodb+srv://academypro-admin:<password>@academypro-cluster.xxxxx.mongodb.net/academypro?retryWrites=true&w=majority
```

**Important**: Replace `<password>` with the actual password you generated!

### Step 7: Seed Your Database
Run this command to create your admin and student users:

```bash
npm run seed-basic
```

## 🔐 Default Login Credentials

After seeding, you can login with:

### Admin Account
- **Email**: `admin@academypro.com`
- **Username**: `admin`
- **Password**: `admin123`

### Student Account  
- **Email**: `student@academypro.com`
- **Username**: `student`
- **Password**: `student123`
- **Student ID**: `STU001`

> **Note**: Your app currently uses **username** for login, not email.

## 🛠️ Troubleshooting

### Connection Issues?

**Authentication Failed**:
- Check username/password in connection string
- Verify database user has correct permissions

**Network Error**:
- Ensure IP address is whitelisted
- Check internet connection

**Database Not Found**:
- MongoDB will create the database automatically on first write
- Make sure database name in connection string matches

### Testing Connection
Test your MongoDB Atlas connection with:
```bash
npm run test-db
```

This will verify your connection and show you database information.

### Seeding Database
Once connection is confirmed, create your users:
```bash
npm run seed-basic
```

## 📊 Atlas Dashboard Features

### Monitor Your Database:
- **Metrics**: View performance and usage
- **Real-time Performance**: Monitor queries and operations
- **Alerts**: Set up notifications for issues

### Database Tools:
- **Data Explorer**: Browse your collections in the browser
- **Charts**: Create visualizations of your data
- **Realm**: Add authentication and sync features

## 🔒 Security Best Practices

### Development:
- ✅ Use IP whitelist (0.0.0.0/0 for development)
- ✅ Create separate database users for different environments
- ✅ Use strong passwords

### Production:
- ✅ Restrict IP addresses to your server IPs only
- ✅ Use different database for production
- ✅ Enable MongoDB Atlas security features
- ✅ Regular backups and monitoring

## 💰 Pricing

### Free Tier (M0):
- ✅ 512 MB storage
- ✅ Shared RAM and vCPU
- ✅ Perfect for development and small projects
- ✅ No credit card required

### Paid Tiers:
- Start at $9/month for dedicated resources
- Scale up as your application grows

---

## ✅ Quick Checklist

- [ ] MongoDB Atlas account created
- [ ] Free cluster deployed  
- [ ] Database user created with password
- [ ] IP address whitelisted (0.0.0.0/0 for development)
- [ ] Connection string copied
- [ ] `.env.local` updated with connection string
- [ ] `npm run test-db` executed successfully
- [ ] `npm run seed-basic` executed successfully
- [ ] Can login with username: admin / password: admin123

Your MongoDB Atlas setup is complete! 🎉
