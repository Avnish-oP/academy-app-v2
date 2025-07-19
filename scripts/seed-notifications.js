const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Notification schema (same as the model)
const NotificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    type: {
      type: String,
      enum: ['announcement', 'reminder', 'warning', 'success', 'info'],
      required: [true, 'Notification type is required'],
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    recipients: {
      users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }],
      roles: [{
        type: String,
        enum: ['student', 'admin', 'faculty'],
      }],
      courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      }],
      sendToAll: {
        type: Boolean,
        default: false,
      },
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender is required'],
    },
    scheduledAt: Date,
    sentAt: Date,
    channels: {
      push: {
        type: Boolean,
        default: true,
      },
      email: {
        type: Boolean,
        default: false,
      },
      sms: {
        type: Boolean,
        default: false,
      },
      inApp: {
        type: Boolean,
        default: true,
      },
    },
    readBy: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      readAt: {
        type: Date,
        default: Date.now,
      },
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: Date,
    attachments: [{
      name: String,
      url: String,
      type: String,
    }],
    actionButton: {
      text: String,
      url: String,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

// User schema for getting admin users
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  phone: String,
  dateOfBirth: Date,
  enrollmentDate: Date,
  class: String,
  isActive: Boolean,
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

const sampleNotifications = [
  {
    title: "Welcome to AcademyPro Digital Platform",
    message: `Dear Students,

Welcome to our new digital learning platform! We're excited to have you on board.

Key features available to you:
• Access to all course materials and study resources
• Real-time notifications for important updates
• Download materials directly from Google Drive links
• Track your academic progress
• Receive timely reminders for assignments and tests

If you need any assistance, please don't hesitate to contact our support team.

Happy Learning!
AcademyPro Team`,
    type: 'announcement',
    priority: 'high',
    recipients: { sendToAll: true, users: [], roles: [], courses: [] },
    channels: { inApp: true, push: true, email: false, sms: false },
    sentAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    actionButton: {
      text: 'Explore Platform',
      url: '/courses'
    },
    readBy: [] // Will be populated randomly
  },
  {
    title: "Upcoming Mock Test - IIT JEE Preparation",
    message: `Attention Class 12 Students!

Your monthly IIT JEE mock test is scheduled for this Saturday, March 16, 2025.

Test Details:
• Date: Saturday, March 16, 2025
• Time: 10:00 AM - 1:00 PM
• Duration: 3 hours
• Subjects: Physics, Chemistry, Mathematics
• Mode: Online

Important Instructions:
1. Join the test link 15 minutes before start time
2. Ensure stable internet connection
3. Keep calculator and rough sheets ready
4. Submit before the deadline

Results will be declared within 48 hours of completion.

Best of luck!`,
    type: 'reminder',
    priority: 'high',
    recipients: { sendToAll: false, users: [], roles: ['student'], courses: [] },
    channels: { inApp: true, push: true, email: true, sms: false },
    sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // expires in 2 days
    actionButton: {
      text: 'View Test Details',
      url: '/tests'
    },
    readBy: []
  },
  {
    title: "Chemistry Lab Session Rescheduled",
    message: `Dear Class 11 Students,

Due to equipment maintenance, tomorrow's Chemistry lab session has been rescheduled.

Original Schedule:
• Date: March 9, 2025 (Tomorrow)
• Time: 2:00 PM - 4:00 PM

New Schedule:
• Date: March 11, 2025 (Monday)
• Time: 2:00 PM - 4:00 PM
• Venue: Chemistry Lab (Same)

Topics to be covered:
- Qualitative analysis of organic compounds
- Identification of functional groups
- Safety procedures in organic chemistry

Please bring your lab manuals and safety equipment.

Sorry for the inconvenience caused.`,
    type: 'warning',
    priority: 'medium',
    recipients: { sendToAll: false, users: [], roles: ['student'], courses: [] },
    channels: { inApp: true, push: true, email: false, sms: false },
    sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    readBy: []
  },
  {
    title: "New Study Material Uploaded - Physics",
    message: `Hello Students!

New Physics study material has been uploaded to your course section.

New Materials Added:
• Wave Optics - Complete Chapter Notes
• Solved Examples and Practice Problems
• Previous Year JEE Questions (2020-2024)
• Video lecture recordings
• Quick revision formulas

These materials are now available in the Physics section under Class 12 courses.

The materials are provided as Google Drive links for easy access and download.

Happy studying!`,
    type: 'info',
    priority: 'medium',
    recipients: { sendToAll: true, users: [], roles: [], courses: [] },
    channels: { inApp: true, push: true, email: false, sms: false },
    sentAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    actionButton: {
      text: 'Access Materials',
      url: '/courses'
    },
    readBy: []
  },
  {
    title: "Assignment Submission Successful",
    message: `Congratulations!

Your Mathematics assignment on "Integral Calculus" has been successfully submitted.

Submission Details:
• Assignment: Integration Techniques and Applications
• Submitted on: March 8, 2025 at 11:30 PM
• Status: Submitted Successfully
• Submission ID: MATH-2025-INT-001

Your assignment will be evaluated within 3-5 working days. You'll receive detailed feedback and grades once the evaluation is complete.

Keep up the excellent work!

Mathematics Department`,
    type: 'success',
    priority: 'low',
    recipients: { sendToAll: false, users: [], roles: ['student'], courses: [] },
    channels: { inApp: true, push: false, email: false, sms: false },
    sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    readBy: []
  },
  {
    title: "Parent-Teacher Meeting Reminder",
    message: `Dear Students and Parents,

This is a reminder about the upcoming Parent-Teacher Meeting scheduled for next week.

Meeting Details:
• Date: March 15, 2025 (Saturday)
• Time: 9:00 AM - 5:00 PM
• Venue: Academy Main Building

Schedule by Class:
• Classes 6-8: 9:00 AM - 12:00 PM
• Classes 9-10: 1:00 PM - 3:00 PM  
• Classes 11-12: 3:00 PM - 5:00 PM

Discussion Topics:
- Academic progress review
- Subject-wise performance analysis
- Career guidance and counseling
- Upcoming examination preparation
- Fee and administrative updates

Please confirm your attendance through the parent portal.

For any queries, contact the administration office.`,
    type: 'reminder',
    priority: 'medium',
    recipients: { sendToAll: true, users: [], roles: [], courses: [] },
    channels: { inApp: true, push: true, email: true, sms: true },
    sentAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    actionButton: {
      text: 'Confirm Attendance',
      url: '/parent-portal'
    },
    readBy: []
  }
];

const seedNotifications = async () => {
  try {
    console.log('🔔 Starting notifications seeding...');

    // Clear existing notifications
    await Notification.deleteMany({});
    console.log('🗑️  Cleared existing notifications');

    // Find admin users to assign as senders
    const adminUsers = await User.find({ role: 'admin' });
    
    if (adminUsers.length === 0) {
      console.log('❌ No admin users found. Please run user seeding first.');
      return;
    }

    console.log(`👨‍💼 Found ${adminUsers.length} admin user(s)`);

    // Find student users to simulate read status
    const studentUsers = await User.find({ role: 'student' });
    console.log(`👨‍🎓 Found ${studentUsers.length} student user(s)`);

    // Assign random admin as sender and simulate read status for each notification
    const notificationsWithSenders = sampleNotifications.map(notification => {
      const randomAdmin = adminUsers[Math.floor(Math.random() * adminUsers.length)];
      
      // Simulate some students have read the notification
      const readBy = [];
      if (studentUsers.length > 0) {
        const readCount = Math.floor(Math.random() * Math.min(studentUsers.length, 5)); // 0-5 reads
        const shuffledStudents = [...studentUsers].sort(() => 0.5 - Math.random());
        
        for (let i = 0; i < readCount; i++) {
          readBy.push({
            userId: shuffledStudents[i]._id,
            readAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000) // random time in last 24h
          });
        }
      }

      return {
        ...notification,
        sender: randomAdmin._id,
        readBy
      };
    });

    // Insert notifications
    const insertedNotifications = await Notification.insertMany(notificationsWithSenders);
    console.log(`✅ Successfully seeded ${insertedNotifications.length} notifications`);

    // Summary
    console.log('\n📊 Seeding Summary:');
    console.log(`• Total notifications: ${insertedNotifications.length}`);
    console.log(`• Types: ${[...new Set(insertedNotifications.map(n => n.type))].join(', ')}`);
    console.log(`• Priority levels: ${[...new Set(insertedNotifications.map(n => n.priority))].join(', ')}`);
    console.log(`• With action buttons: ${insertedNotifications.filter(n => n.actionButton).length}`);
    console.log(`• With expiry dates: ${insertedNotifications.filter(n => n.expiresAt).length}`);

    console.log('\n🎉 Notifications seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding notifications:', error);
  }
};

const main = async () => {
  await connectDB();
  await seedNotifications();
  await mongoose.connection.close();
  console.log('👋 Database connection closed');
};

// Run the seeding
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { seedNotifications };
