# 📚 Material Upload Instructions

## ✅ **System is Ready!**
Your database now has proper classes and subjects. No more confusion about "course IDs"!

## 🎯 **How to Upload Materials (Step by Step):**

### **Step 1: Navigate to Admin Courses**
1. Login as admin
2. Go to **Admin → Courses** (in your navbar)
3. You'll see a list of classes (Class 6, 7, 8, 9, 10, 11, 12)

### **Step 2: Select Class & Subject**
1. **Click on any class** (e.g., "Class 10")
2. **Click on any subject** (e.g., "Mathematics", "Physics", "Chemistry", etc.)
3. You'll see the materials for that specific subject

### **Step 3: Add Material**
1. **Click "Add Material"** button
2. Fill in the form:
   - **Title**: e.g., "Chapter 1 - Real Numbers"
   - **Description**: Brief explanation of the material
   - **Type**: Choose from PDF, Video, Document, Presentation
   - **Google Drive Link**: Paste your Google Drive share link

### **Step 4: Google Drive Link Setup**
1. Upload your file to Google Drive
2. Right-click → Get shareable link
3. Make sure it's set to "Anyone with the link can view"
4. Copy the link (should start with `https://drive.google.com/`)
5. Paste it in the "Google Drive Link" field

## 🏗️ **Database Structure:**
- **Classes**: Class 6, 7, 8, 9, 10, 11, 12
- **Subjects per Class**: Mathematics, Physics, Chemistry, Biology, English, etc.
- **Materials**: Stored with Google Drive links (no file uploads needed)

## ❌ **What NOT to Use:**
- Don't use any "course ID" fields - those are from old system
- Don't try to upload files directly - use Google Drive links
- The old `/api/admin/materials/upload` route is now disabled

## ✅ **Benefits:**
- **No file storage issues** - Everything stored on Google Drive
- **Easy sharing** - Students get direct Google Drive links
- **Organized structure** - Materials organized by class and subject
- **No confusion** - Clear class/subject selection

## 🔄 **If You Need to Reset:**
Run this command to recreate classes and subjects:
```bash
node scripts/seed-classes-subjects.js
```

## 📱 **Student View:**
Students will see their materials on the home page, filtered by their assigned class ID.

---
**✨ Your material upload system is now properly configured!**
