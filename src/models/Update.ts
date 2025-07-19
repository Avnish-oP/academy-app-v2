import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IUpdate extends Document {
  _id: string;
  title: string;
  content: string;
  type: 'general' | 'exam' | 'holiday' | 'schedule' | 'important';
  priority: 'low' | 'medium' | 'high';
  author: mongoose.Types.ObjectId;
  isPublished: boolean;
  publishDate: Date;
  expiryDate?: Date;
  targetAudience: {
    classes: mongoose.Types.ObjectId[];
    sendToAll: boolean;
  };
  mentions: {
    users: mongoose.Types.ObjectId[];
    usernames: string[];
  };
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const UpdateSchema: Schema<IUpdate> = new Schema(
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
      type: Schema.Types.ObjectId,
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
        validator: function(this: IUpdate, value: Date) {
          return !value || value > this.publishDate;
        },
        message: 'Expiry date must be after publish date'
      }
    },
    targetAudience: {
      classes: [{
        type: Schema.Types.ObjectId,
        ref: 'Class',
      }],
      sendToAll: {
        type: Boolean,
        default: true,
      },
    },
    mentions: {
      users: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
      }],
      usernames: [{
        type: String,
        trim: true,
      }],
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

// Indexes for better performance
UpdateSchema.index({ publishDate: -1 });
UpdateSchema.index({ isPublished: 1, publishDate: -1 });
UpdateSchema.index({ type: 1, publishDate: -1 });
UpdateSchema.index({ priority: 1, publishDate: -1 });
UpdateSchema.index({ expiryDate: 1 });

// Virtual for checking if update is expired
UpdateSchema.virtual('isExpired').get(function() {
  return this.expiryDate && this.expiryDate < new Date();
});

// Static method to get active updates
UpdateSchema.statics.getActiveUpdates = function() {
  return this.find({
    isPublished: true,
    $or: [
      { expiryDate: { $exists: false } },
      { expiryDate: null },
      { expiryDate: { $gt: new Date() } }
    ]
  }).sort({ priority: -1, publishDate: -1 });
};

const Update: Model<IUpdate> = mongoose.models.Update || mongoose.model<IUpdate>('Update', UpdateSchema);

export default Update;
