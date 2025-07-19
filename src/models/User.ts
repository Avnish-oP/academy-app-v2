import mongoose, { Document, Schema, Model } from 'mongoose';

// Define the User interface
export interface IUser extends Document {
  _id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  role: 'student' | 'admin' | 'faculty';
  studentId?: string;
  phone?: string;
  avatar?: string;
  enrolledCourses: mongoose.Types.ObjectId[];
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
  profile: {
    class?: string;
    classId?: mongoose.Types.ObjectId; // Reference to Class model
    batch?: string;
    parentName?: string;
    parentPhone?: string;
    address?: string;
    dateOfBirth?: Date;
  };
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Define the User schema
const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: ['student', 'admin', 'faculty'],
      default: 'student',
    },
    studentId: {
      type: String,
      unique: true,
      sparse: true,
    },
    phone: {
      type: String,
      validate: {
        validator: function(v: string) {
          // Allow empty phone or valid 10-digit number
          return !v || /^[0-9]{10}$/.test(v);
        },
        message: 'Please enter a valid 10-digit phone number'
      },
    },
    avatar: {
      type: String,
    },
    enrolledCourses: [{
      type: Schema.Types.ObjectId,
      ref: 'Course',
    }],
    notifications: {
      push: {
        type: Boolean,
        default: true,
      },
      email: {
        type: Boolean,
        default: true,
      },
      sms: {
        type: Boolean,
        default: false,
      },
    },
    profile: {
      class: String,
      classId: {
        type: Schema.Types.ObjectId,
        ref: 'Class',
      },
      batch: String,
      parentName: String,
      parentPhone: String,
      address: String,
      dateOfBirth: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);

// Add indexes for better performance (remove duplicates)
UserSchema.index({ role: 1 });

// Create and export the User model
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
