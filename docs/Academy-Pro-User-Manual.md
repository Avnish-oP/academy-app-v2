# Academy Pro - User Manual
*Complete Learning Management System*

**Version:** 1.0  
**Date:** July 19, 2025  
**Document Type:** User Manual  

---

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Admin User Guide](#admin-user-guide)
4. [Student User Guide](#student-user-guide)
5. [Features Overview](#features-overview)
6. [Troubleshooting](#troubleshooting)
7. [Appendix](#appendix)

---

## Introduction

### About Academy Pro
Academy Pro is a comprehensive Learning Management System (LMS) designed specifically for coaching institutes and educational organizations. It provides a complete digital platform for managing students, courses, materials, notifications, and academic progress.

### Key Features
- **User Management**: Admin and student role-based access
- **Course Management**: Complete academic structure from Class 1-12
- **Material Distribution**: Upload and share study materials
- **Notification System**: Important announcements and updates
- **Progress Tracking**: Monitor student engagement and performance
- **Progressive Web App (PWA)**: Install as mobile/desktop app

### System Requirements
- **Web Browser**: Chrome, Firefox, Safari, Edge (latest versions)
- **Internet Connection**: Required for full functionality
- **Device**: Desktop, tablet, or mobile device
- **Screen Resolution**: Minimum 1024x768 recommended

---

## Getting Started

### Accessing the Application

1. **Web Browser**: Navigate to your Academy Pro URL
2. **Mobile App**: Install as PWA from browser menu
3. **Login Page**: Enter your credentials to access the system

### Login Process

1. Open the Academy Pro application
2. Select your user type: **Student** or **Admin**
3. Enter your **Username** and **Password**
4. Click **Sign In** to access your dashboard

**Default Credentials** (Change after first login):
- **Admin**: `admin` / `admin123`
- **Student**: `student1` / `student123`

---

## Admin User Guide

### Admin Dashboard Overview

The admin dashboard provides comprehensive control over the entire academy system.

#### Dashboard Sections
- **User Management**: Manage students and staff
- **Analytics**: View system statistics and reports
- **Quick Actions**: Common administrative tasks
- **Recent Activity**: Latest system activities

### 1. User Management

#### Adding Individual Students

1. Go to **Admin Dashboard**
2. Click **Users** tab
3. Click **+ Add Individual** button
4. Fill in student details:
   - **Name**: Full name of the student
   - **Username**: Unique login identifier
   - **Email**: Student's email address
   - **Phone**: Contact number
   - **Class**: Select from available classes
   - **Password**: Temporary password (student should change)
5. Click **Save** to create the account

#### Bulk Student Upload

1. Click **+ Bulk Upload (CSV)** button
2. Download the CSV template
3. Fill the template with student data:
   ```csv
   name,username,email,phone,class,password
   John Doe,john123,john@email.com,9876543210,Class 10,temp123
   ```
4. Upload the completed CSV file
5. Review the import results
6. Confirm to create all accounts

#### Managing Existing Users

1. **View Users**: See all registered students and staff
2. **Edit User**: Click edit icon to modify details
3. **Delete User**: Remove users from the system
4. **Activate/Deactivate**: Control user access

### 2. Class & Subject Management

#### Creating Classes

1. Navigate to **Classes** section
2. Click **Add New Class**
3. Enter class details:
   - **Name**: e.g., "Class 10"
   - **Level**: Numeric level (1-12)
   - **Category**: Primary, Middle School, Secondary, Senior Secondary
   - **Description**: Brief description of the class
4. Save the class

#### Managing Subjects

1. Go to **Subjects** section
2. Click **Add Subject**
3. Fill subject information:
   - **Name**: Subject name
   - **Class**: Associated class
   - **Description**: Subject details
   - **Order**: Display order
4. Save the subject

### 3. Material Management

#### Uploading Study Materials

1. Go to **Materials** section
2. Click **Upload Material**
3. Select file and fill details:
   - **Title**: Material title
   - **Subject**: Associated subject
   - **Class**: Target class
   - **Description**: Brief description
   - **File**: Upload PDF, DOC, or image files
4. Click **Upload** to publish

#### Managing Materials

- **View All Materials**: See uploaded content
- **Edit Materials**: Modify details and descriptions
- **Delete Materials**: Remove outdated content
- **Download Reports**: Track material usage

### 4. Notification & Communication

#### Sending Notifications

1. Go to **Notifications** section
2. Click **Create Notification**
3. Fill notification details:
   - **Title**: Notification headline
   - **Message**: Detailed content
   - **Type**: Announcement, Reminder, Warning, Success, Info
   - **Priority**: Low, Medium, High
   - **Target**: Specific classes or all students
4. Click **Send** to broadcast

#### Managing Announcements

1. Go to **Updates** section
2. Click **Create Update**
3. Enter announcement details:
   - **Title**: Update headline
   - **Content**: Full announcement text
   - **Important**: Mark as important if urgent
   - **Target Classes**: Select specific classes or all
4. Publish the update

### 5. Reports & Analytics

#### User Statistics
- Total registered students
- Active users this month
- New registrations
- User activity patterns

#### Content Analytics
- Most downloaded materials
- Popular subjects
- Class-wise engagement
- Material usage trends

#### System Health
- Database status
- Server performance
- Error logs
- Security alerts

---

## Student User Guide

### Student Dashboard Overview

The student dashboard provides easy access to all learning resources and communications.

#### Dashboard Sections
- **Welcome Panel**: Personal information and quick stats
- **Recent Materials**: Latest study materials
- **Notifications**: Important messages
- **Updates**: Academy announcements
- **Progress Tracking**: Academic progress overview

### 1. Accessing Study Materials

#### Browsing Materials

1. Go to **Courses** section
2. Select your **Class** from the dropdown
3. Choose **Subject** to filter materials
4. Browse available study materials

#### Downloading Materials

1. Click on any material title
2. View material details and description
3. Click **Download** button
4. Save file to your device

#### Material Types Available
- **PDFs**: Textbooks, notes, question papers
- **Documents**: Study guides, reference materials
- **Images**: Diagrams, charts, infographics

### 2. Managing Notifications

#### Reading Notifications

1. Check **Notifications** panel on dashboard
2. Click on any notification to read full content
3. Notifications are automatically marked as read
4. Filter by notification type or priority

#### Notification Types
- 📢 **Announcements**: General academy news
- ⏰ **Reminders**: Important dates and deadlines
- ⚠️ **Warnings**: Urgent information
- ✅ **Success**: Achievement notifications
- ℹ️ **Info**: General information

### 3. Staying Updated

#### Academy Updates

1. Visit **Updates** section
2. Read latest academy announcements
3. Check for important notices marked with ⭐
4. Stay informed about:
   - Exam schedules
   - Holiday announcements
   - New course offerings
   - Academy events

### 4. Profile Management

#### Viewing Profile Information

1. Check **Profile** section on dashboard
2. View your personal details:
   - Name and contact information
   - Class and student ID
   - Account status
   - Last login time

#### Updating Profile

1. Contact academy admin for profile changes
2. Provide updated information via email or phone
3. Admin will verify and update your profile

### 5. Mobile App Features

#### Installing as Mobile App

1. Open Academy Pro in mobile browser
2. Tap browser menu (three dots)
3. Select "Add to Home Screen" or "Install App"
4. Follow prompts to install

#### Offline Access

- Previously viewed materials remain accessible
- Notifications sync when connection restored
- Basic app functionality works offline

---

## Features Overview

### Progressive Web App (PWA)
- **Install on Device**: Works like native app
- **Offline Support**: Access cached content
- **Push Notifications**: Receive instant alerts
- **Responsive Design**: Works on all devices

### Security Features
- **Secure Authentication**: JWT-based login system
- **Role-based Access**: Admin and student permissions
- **Data Protection**: Encrypted data transmission
- **Session Management**: Automatic logout for security

### Content Management
- **File Upload**: Support for multiple file types
- **Version Control**: Track material updates
- **Categorization**: Organize by class and subject
- **Search Functionality**: Find content quickly

### Communication Tools
- **Notification System**: Multi-type messaging
- **Announcement Board**: Academy-wide updates
- **Priority Messaging**: Urgent communication
- **Read Status**: Track message delivery

---

## Troubleshooting

### Common Issues

#### Login Problems

**Issue**: Cannot login to the system
**Solutions**:
1. Check username and password spelling
2. Ensure correct user type is selected
3. Contact admin if password forgotten
4. Clear browser cache and cookies
5. Try different browser or incognito mode

**Issue**: "Temporarily down" message after login
**Solutions**:
1. Refresh the page once
2. Check internet connection
3. Wait a few moments and try again
4. Contact technical support if persistent

#### Material Access Issues

**Issue**: Cannot download materials
**Solutions**:
1. Check internet connection
2. Ensure sufficient device storage
3. Try different browser
4. Contact admin if material missing

**Issue**: Slow loading times
**Solutions**:
1. Check internet speed
2. Close unnecessary browser tabs
3. Clear browser cache
4. Use wired connection if possible

#### Notification Problems

**Issue**: Not receiving notifications
**Solutions**:
1. Check notification permissions in browser
2. Enable push notifications
3. Refresh the page
4. Contact admin to verify notification settings

### Technical Support

#### Before Contacting Support
1. Note the exact error message
2. Record the steps that led to the issue
3. Check your internet connection
4. Try the solution in incognito/private mode

#### Contact Information
- **Technical Support**: support@academypro.com
- **Admin Support**: admin@academypro.com
- **Phone**: +91-XXX-XXX-XXXX
- **Support Hours**: 9 AM - 6 PM (Monday to Friday)

---

## Appendix

### A. Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Login Page | Ctrl + L |
| Dashboard | Ctrl + H |
| Materials | Ctrl + M |
| Notifications | Ctrl + N |
| Logout | Ctrl + Shift + Q |

### B. File Format Support

#### Supported Upload Formats (Admin)
- **Documents**: PDF, DOC, DOCX, TXT
- **Images**: JPG, JPEG, PNG, GIF
- **Archives**: ZIP (for bulk materials)

#### Maximum File Sizes
- **Single File**: 10 MB
- **Bulk Upload**: 50 MB total
- **CSV Import**: 5 MB

### C. Browser Compatibility

| Browser | Minimum Version | Recommended |
|---------|----------------|-------------|
| Chrome | 90+ | Latest |
| Firefox | 88+ | Latest |
| Safari | 14+ | Latest |
| Edge | 90+ | Latest |

### D. Mobile Compatibility

#### Supported Devices
- **iOS**: iPhone 8+ (iOS 12+)
- **Android**: Android 8.0+
- **Tablets**: iPad Air+ / Android tablets 10"+

#### PWA Installation
1. **iOS**: Safari → Share → Add to Home Screen
2. **Android**: Chrome → Menu → Add to Home Screen
3. **Desktop**: Chrome → Install App (address bar icon)

### E. Data Backup & Security

#### Student Data Protection
- All personal information encrypted
- Secure password storage (hashed)
- Regular automated backups
- GDPR compliant data handling

#### Privacy Policy
- Student data used only for educational purposes
- No third-party data sharing without consent
- Right to data deletion upon request
- Transparent data usage policies

### F. System Updates

#### Update Schedule
- **Security Updates**: As needed (immediate)
- **Feature Updates**: Monthly
- **Major Releases**: Quarterly
- **Maintenance**: Weekly (Sunday 2-4 AM)

#### Update Notifications
- System maintenance notifications sent 24 hours prior
- Feature updates announced in academy updates
- Emergency updates may occur without prior notice

---

**Document Information**:
- **Created**: July 19, 2025
- **Version**: 1.0
- **Last Updated**: July 19, 2025
- **Next Review**: October 19, 2025

**Contact Information**:
- **Academy Pro Support**: support@academypro.com
- **Documentation Team**: docs@academypro.com

---

*This manual is a living document and will be updated regularly to reflect new features and improvements to the Academy Pro system.*
