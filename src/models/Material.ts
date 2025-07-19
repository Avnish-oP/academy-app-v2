import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IMaterial extends Document {
  _id: string;
  title: string;
  description: string;
  type: 'pdf' | 'video' | 'document' | 'presentation';
  driveLink: string;
  uploadDate: Date;
  downloadCount: number;
  uploadedBy: mongoose.Types.ObjectId;
  subject: mongoose.Types.ObjectId;
  class: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MaterialSchema: Schema<IMaterial> = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Material title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Material description is required'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    type: {
      type: String,
      required: [true, 'Material type is required'],
      enum: ['pdf', 'video', 'document', 'presentation'],
    },
    driveLink: {
      type: String,
      required: [true, 'Drive link is required'],
      validate: {
        validator: function(v: string) {
          // Validate Google Drive link format
          return /^https:\/\/(drive\.google\.com|docs\.google\.com)/.test(v);
        },
        message: 'Please provide a valid Google Drive link'
      }
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    downloadCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subject: {
      type: Schema.Types.ObjectId,
      ref: 'Subject',
      required: true,
    },
    class: {
      type: Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
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
MaterialSchema.index({ subject: 1 });
MaterialSchema.index({ class: 1 });
MaterialSchema.index({ type: 1 });
MaterialSchema.index({ isActive: 1 });
MaterialSchema.index({ uploadDate: -1 });

const Material: Model<IMaterial> = mongoose.models.Material || mongoose.model<IMaterial>('Material', MaterialSchema);

export default Material;
