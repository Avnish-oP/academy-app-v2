const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

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

// Update schema (same as the model)
const UpdateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Update title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Update content is required'],
      maxlength: [2000, 'Content cannot exceed 2000 characters'],
    },
    type: {
      type: String,
      required: [true, 'Update type is required'],
      enum: ['general', 'exam', 'holiday', 'schedule', 'important'],
      default: 'general',
    },
    priority: {
      type: String,
      required: [true, 'Priority is required'],
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
      validate: {
        validator: function(value) {
          return !value || value > this.publishDate;
        },
        message: 'Expiry date must be after publish date'
      }
    },
    targetAudience: {
      classes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
      }],
      sendToAll: {
        type: Boolean,
        default: true,
      },
    },
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Update = mongoose.models.Update || mongoose.model('Update', UpdateSchema);

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

const sampleUpdates = [
  {
    title: "Welcome to AcademyPro - New Academic Year 2025",
    content: `Dear Students and Parents,

We are excited to welcome you to the new academic year 2025! This year brings new opportunities, enhanced learning experiences, and exciting challenges.

Key highlights for this year:
• New advanced courses in Mathematics and Science
• Updated curriculum aligned with latest board requirements
• Enhanced digital learning platform
• Regular mock tests and assessments
• Career guidance sessions

We look forward to an excellent academic year ahead. Please ensure you have all the required materials and are ready for the first day of classes.

Best regards,
AcademyPro Management`,
    type: 'important',
    priority: 'high',
    isPublished: true,
    publishDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    viewCount: 45
  },
  {
    title: "Mid-Term Examination Schedule Released",
    content: `The mid-term examination schedule for all classes has been released. Please check the detailed timetable on your student portal.

Important dates:
• Class 10-12: March 15-25, 2025
• Class 6-9: March 20-28, 2025
• Result Declaration: April 5, 2025

Examination Guidelines:
1. Report to exam center 30 minutes before the exam
2. Carry valid ID proof and admit card
3. Electronic devices are strictly prohibited
4. Follow the dress code

For any queries regarding the examination, please contact the academic office.

Good luck with your preparations!`,
    type: 'exam',
    priority: 'high',
    isPublished: true,
    publishDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    viewCount: 78
  },
  {
    title: "Holiday Notice - Holi Festival",
    content: `Dear Students and Staff,

The academy will remain closed on March 13-14, 2025 (Monday-Tuesday) on account of Holi festival.

Classes will resume on Wednesday, March 15, 2025, as per the regular schedule.

We wish everyone a safe and colorful Holi celebration with family and friends.

Enjoy the festivities!

Academy Administration`,
    type: 'holiday',
    priority: 'medium',
    isPublished: true,
    publishDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // expires in 5 days
    viewCount: 32
  },
  {
    title: "New Library Hours and Digital Resources",
    content: `We are pleased to announce extended library hours and new digital resources for our students.

New Library Timings:
Monday to Friday: 8:00 AM - 8:00 PM
Saturday: 9:00 AM - 6:00 PM
Sunday: 10:00 AM - 4:00 PM

New Digital Resources:
• Online academic databases
• E-book collection (10,000+ titles)
• Digital magazine subscriptions
• Research paper access
• Interactive learning modules

Students can access these resources using their student portal credentials. Library orientation sessions will be conducted next week.

Happy learning!`,
    type: 'general',
    priority: 'medium',
    isPublished: true,
    publishDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    viewCount: 23
  },
  {
    title: "Updated Class Schedule - Physics Lab Sessions",
    content: `Due to equipment upgrades in the Physics laboratory, there will be temporary changes to the lab session schedule.

Effective from March 10, 2025:

Class 11 Physics Lab:
• Section A: Tuesday 2:00-4:00 PM
• Section B: Thursday 2:00-4:00 PM

Class 12 Physics Lab:
• Section A: Monday 2:00-4:00 PM
• Section B: Wednesday 2:00-4:00 PM

The new equipment includes:
- Advanced digital oscilloscopes
- Precision measurement instruments
- Updated safety equipment

Regular schedule will resume from March 25, 2025.

Science Department`,
    type: 'schedule',
    priority: 'medium',
    isPublished: true,
    publishDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    viewCount: 15
  },
  {
    title: "Parent-Teacher Meeting - Important Information",
    content: `Annual Parent-Teacher Meeting is scheduled for March 18, 2025 (Saturday).

Schedule:
• Classes 6-8: 9:00 AM - 12:00 PM
• Classes 9-10: 1:00 PM - 4:00 PM
• Classes 11-12: 10:00 AM - 1:00 PM

What to expect:
- Individual student progress review
- Subject-wise performance analysis
- Academic planning for the next term
- Doubt clarification sessions
- Fee and administrative updates

Please bring:
✓ Student progress report
✓ Previous term's results
✓ Any specific concerns or queries

Registration is mandatory. Please confirm your attendance through the parent portal by March 15, 2025.

We look forward to meaningful discussions about your child's academic journey.`,
    type: 'important',
    priority: 'high',
    isPublished: true,
    publishDate: new Date(),
    viewCount: 8
  }
];

const seedUpdates = async () => {
  try {
    console.log('🌱 Starting updates seeding...');

    // Clear existing updates
    await Update.deleteMany({});
    console.log('🗑️  Cleared existing updates');

    // Find admin users
    const adminUsers = await User.find({ role: 'admin' });
    
    if (adminUsers.length === 0) {
      console.log('❌ No admin users found. Please run user seeding first.');
      return;
    }

    console.log(`👨‍💼 Found ${adminUsers.length} admin user(s)`);

    // Assign random admin as author for each update
    const updatesWithAuthors = sampleUpdates.map(update => ({
      ...update,
      author: adminUsers[Math.floor(Math.random() * adminUsers.length)]._id
    }));

    // Insert updates
    const insertedUpdates = await Update.insertMany(updatesWithAuthors);
    console.log(`✅ Successfully seeded ${insertedUpdates.length} updates`);

    // Summary
    console.log('\n📊 Seeding Summary:');
    console.log(`• Total updates: ${insertedUpdates.length}`);
    console.log(`• Published: ${insertedUpdates.filter(u => u.isPublished).length}`);
    console.log(`• Types: ${[...new Set(insertedUpdates.map(u => u.type))].join(', ')}`);
    console.log(`• Priority levels: ${[...new Set(insertedUpdates.map(u => u.priority))].join(', ')}`);

    console.log('\n🎉 Updates seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding updates:', error);
  }
};

const main = async () => {
  await connectDB();
  await seedUpdates();
  await mongoose.connection.close();
  console.log('👋 Database connection closed');
};

// Run the seeding
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { seedUpdates };
