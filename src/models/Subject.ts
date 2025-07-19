import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ISubject extends Document {
  _id: string;
  name: string;
  description: string;
  class: mongoose.Types.ObjectId;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema: Schema<ISubject> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Subject description is required'],
      maxlength: [300, 'Description cannot exceed 300 characters'],
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    order: {
      type: Number,
      required: true,
      min: 1,
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
SubjectSchema.index({ class: 1 });
SubjectSchema.index({ class: 1, order: 1 });
SubjectSchema.index({ isActive: 1 });

const Subject: Model<ISubject> = mongoose.models.Subject || mongoose.model<ISubject>('Subject', SubjectSchema);

export default Subject;
