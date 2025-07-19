import mongoose, { Document, Schema, Model } from 'mongoose';

export interface INotification extends Document {
  _id: string;
  title: string;
  message: string;
  type: 'announcement' | 'reminder' | 'warning' | 'success' | 'info';
  priority: 'low' | 'medium' | 'high';
  recipients: {
    users: mongoose.Types.ObjectId[];
    roles: string[];
    courses: mongoose.Types.ObjectId[];
    sendToAll: boolean;
  };
  sender: mongoose.Types.ObjectId;
  scheduledAt?: Date;
  sentAt?: Date;
  channels: {
    push: boolean;
    email: boolean;
    sms: boolean;
    inApp: boolean;
  };
  readBy: {
    userId: mongoose.Types.ObjectId;
    readAt: Date;
  }[];
  isActive: boolean;
  expiresAt?: Date;
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
  actionButton?: {
    text: string;
    url: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema<INotification> = new Schema(
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
        type: Schema.Types.ObjectId,
        ref: 'User',
      }],
      roles: [{
        type: String,
        enum: ['student', 'admin', 'faculty'],
      }],
      courses: [{
        type: Schema.Types.ObjectId,
        ref: 'Course',
      }],
      sendToAll: {
        type: Boolean,
        default: false,
      },
    },
    sender: {
      type: Schema.Types.ObjectId,
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
        type: Schema.Types.ObjectId,
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

// Add indexes
NotificationSchema.index({ 'recipients.users': 1 });
NotificationSchema.index({ 'recipients.roles': 1 });
NotificationSchema.index({ 'recipients.courses': 1 });
NotificationSchema.index({ type: 1 });
NotificationSchema.index({ priority: 1 });
NotificationSchema.index({ sentAt: 1 });
NotificationSchema.index({ expiresAt: 1 });

const Notification: Model<INotification> = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
