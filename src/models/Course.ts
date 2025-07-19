import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ICourse extends Document {
  _id: string;
  title: string;
  description: string;
  instructor: string;
  instructorId: mongoose.Types.ObjectId;
  category: string;
  subjects: string[];
  duration: string;
  price: number;
  maxStudents: number;
  enrolledStudents: mongoose.Types.ObjectId[];
  startDate: Date;
  endDate: Date;
  schedule: {
    days: string[];
    time: string;
  };
  materials: {
    title: string;
    description: string;
    fileUrl: string;
    uploadDate: Date;
    fileType: string;
    subject: string;
  }[];
  isActive: boolean;
  rating: number;
  totalRatings: number;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema: Schema<ICourse> = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Course title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Course description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    instructor: {
      type: String,
      required: [true, 'Instructor name is required'],
    },
    instructorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      required: [true, 'Course category is required'],
      enum: ['IIT-JEE', 'NEET', 'Boards', 'Foundation', 'Other'],
    },
    subjects: [{
      type: String,
      required: true,
    }],
    duration: {
      type: String,
      required: [true, 'Course duration is required'],
    },
    price: {
      type: Number,
      required: [true, 'Course price is required'],
      min: [0, 'Price cannot be negative'],
    },
    maxStudents: {
      type: Number,
      required: [true, 'Maximum students limit is required'],
      min: [1, 'At least 1 student should be allowed'],
    },
    enrolledStudents: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    schedule: {
      days: [{
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      }],
      time: {
        type: String,
        required: true,
      },
    },
    materials: [{
      title: {
        type: String,
        required: true,
      },
      description: String,
      fileUrl: {
        type: String,
        required: true,
      },
      uploadDate: {
        type: Date,
        default: Date.now,
      },
      fileType: {
        type: String,
        enum: ['pdf', 'video', 'image', 'document', 'other'],
        required: true,
      },
      subject: String,
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes
CourseSchema.index({ category: 1 });
CourseSchema.index({ isActive: 1 });
CourseSchema.index({ instructorId: 1 });

const Course: Model<ICourse> = mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);

export default Course;
