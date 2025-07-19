import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IClass extends Document {
  _id: string;
  name: string;
  description: string;
  level: number; // 1-12
  category: 'Primary' | 'Middle School' | 'Secondary' | 'Senior Secondary';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ClassSchema: Schema<IClass> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Class name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    description: {
      type: String,
      required: [true, 'Class description is required'],
      maxlength: [300, 'Description cannot exceed 300 characters'],
    },
    level: {
      type: Number,
      required: [true, 'Class level is required'],
      min: 1,
      max: 12,
      unique: true,
    },
    category: {
      type: String,
      required: [true, 'Class category is required'],
      enum: ['Primary', 'Middle School', 'Secondary', 'Senior Secondary'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add indexes
ClassSchema.index({ category: 1 });
ClassSchema.index({ isActive: 1 });

const Class: Model<IClass> = mongoose.models.Class || mongoose.model<IClass>('Class', ClassSchema);

export default Class;
