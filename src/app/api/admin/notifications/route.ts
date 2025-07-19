import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../lib/mongodb';
import Notification from '../../../../models/Notification';
import User from '../../../../models/User';
import jwt from 'jsonwebtoken';

// Verify admin token
async function verifyAdmin(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
                request.cookies.get('token')?.value;

  if (!token) {
    throw new Error('No token provided');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
  const user = await User.findById(decoded.userId);

  if (!user || user.role !== 'admin') {
    throw new Error('Admin access required');
  }

  return user;
}

// Get all notifications (admin view)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    await verifyAdmin(request);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type');
    const priority = searchParams.get('priority');

    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = {};

    if (type && type !== 'all') {
      filter.type = type;
    }

    if (priority && priority !== 'all') {
      filter.priority = priority;
    }

    // Get notifications with pagination
    const notifications = await Notification.find(filter)
      .populate('sender', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Notification.countDocuments(filter);

    // Add read count for each notification
    const notificationsWithStats = notifications.map(notification => ({
      ...notification,
      readCount: notification.readBy.length
    }));

    return NextResponse.json({
      success: true,
      data: {
        notifications: notificationsWithStats,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          count: notifications.length,
          totalNotifications: total
        }
      }
    });

  } catch (error) {
    console.error('Error fetching admin notifications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// Create new notification
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const admin = await verifyAdmin(request);

    const body = await request.json();
    const {
      title,
      message,
      type,
      priority,
      recipients,
      channels,
      expiresAt,
      actionButton,
      sendImmediately = true
    } = body;

    // Validation
    if (!title || !message) {
      return NextResponse.json(
        { success: false, error: 'Title and message are required' },
        { status: 400 }
      );
    }

    if (title.length > 200) {
      return NextResponse.json(
        { success: false, error: 'Title cannot exceed 200 characters' },
        { status: 400 }
      );
    }

    if (message.length > 1000) {
      return NextResponse.json(
        { success: false, error: 'Message cannot exceed 1000 characters' },
        { status: 400 }
      );
    }

    // Create notification
    const notification = new Notification({
      title,
      message,
      type: type || 'info',
      priority: priority || 'medium',
      sender: admin._id,
      recipients: recipients || { sendToAll: true, users: [], roles: [], courses: [] },
      channels: channels || { inApp: true, push: true, email: false, sms: false },
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      actionButton: actionButton || null,
      sentAt: sendImmediately ? new Date() : null
    });

    await notification.save();

    // Populate sender data
    await notification.populate('sender', 'name email');

    return NextResponse.json({
      success: true,
      data: notification,
      message: 'Notification created successfully'
    });

  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}

// Send notification for update
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const admin = await verifyAdmin(request);

    const body = await request.json();
    const { updateId, updateTitle, updateType, recipients } = body;

    if (!updateId || !updateTitle) {
      return NextResponse.json(
        { success: false, error: 'Update ID and title are required' },
        { status: 400 }
      );
    }

    // Create notification for the update
    const notification = new Notification({
      title: `New Update: ${updateTitle}`,
      message: `A new ${updateType || 'general'} update has been posted. Check the updates section for more details.`,
      type: 'announcement',
      priority: updateType === 'important' || updateType === 'exam' ? 'high' : 'medium',
      sender: admin._id,
      recipients: recipients || { sendToAll: true, users: [], roles: [], courses: [] },
      channels: { inApp: true, push: true, email: false, sms: false },
      sentAt: new Date(),
      actionButton: {
        text: 'View Update',
        url: '/updates'
      }
    });

    await notification.save();
    await notification.populate('sender', 'name email');

    return NextResponse.json({
      success: true,
      data: notification,
      message: 'Update notification sent successfully'
    });

  } catch (error) {
    console.error('Error sending update notification:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send update notification' },
      { status: 500 }
    );
  }
}
