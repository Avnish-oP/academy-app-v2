const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/academy';

// User schema (simplified for seeding)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin', 'faculty'], default: 'student' },
  studentId: { type: String },
  phone: { type: String },
  isActive: { type: Boolean, default: true },
  profile: {
    class: String,
    batch: String,
    parentName: String,
    parentPhone: String,
    address: String,
    dateOfBirth: Date
  },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  avatar: String,
  lastLogin: Date,
  notificationPreferences: {
    email: { type: Boolean, default: true },
    push: { type: Boolean, default: true },
    sms: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists');
    } else {
      // Create admin user
      const adminPassword = await bcrypt.hash('admin123', 12);
      const adminUser = new User({
        name: 'Admin User',
        username: 'admin',
        email: 'admin@shivalik.com',
        password: adminPassword,
        role: 'admin',
        phone: '9876543210',
        isActive: true
      });
      await adminUser.save();
      console.log('Created admin user: admin / admin123');
    }

    // Check if student already exists
    const existingStudent = await User.findOne({ 
      $or: [{ username: 'student123' }, { studentId: 'STU20250002' }] 
    });
    if (existingStudent) {
      console.log('Student user already exists');
    } else {
      // Create student user
      const studentPassword = await bcrypt.hash('password123', 12);
      const studentUser = new User({
        name: 'John Doe',
        username: 'student123',
        email: 'student@shivalik.com',
        password: studentPassword,
        role: 'student',
        studentId: 'STU20250002',
        phone: '9876512345',
        isActive: true,
        profile: {
          class: '12th',
          batch: 'JEE-2025',
          parentName: 'Robert Doe',
          parentPhone: '9876554321',
          address: '123 Student Street, Learning City',
          dateOfBirth: new Date('2006-01-15')
        }
      });
      await studentUser.save();
      console.log('Created student user: student123 / password123');
    }

    console.log('\n=== Seed Data Created Successfully ===');
    console.log('Admin Login: admin / admin123');
    console.log('Student Login: student123 / password123');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function
seedDatabase();
