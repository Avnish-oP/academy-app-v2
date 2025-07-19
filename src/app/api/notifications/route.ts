import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../lib/mongodb';
import Notification from '../../../models/Notification';
import User from '../../../models/User';
import jwt from 'jsonwebtoken';

// Get notifications for a user
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get user from token
    const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
                  request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    const skip = (page - 1) * limit;

    // Build filter for notifications targeting this user
    const filter: any = {
      isActive: true,
      $or: [
        { 'recipients.sendToAll': true },
        { 'recipients.users': user._id },
        { 'recipients.roles': user.role },
        { expiresAt: { $exists: false } },
        { expiresAt: null },
        { expiresAt: { $gt: new Date() } }
      ]
    };

    // Filter for unread notifications
    if (unreadOnly) {
      filter['readBy.userId'] = { $ne: user._id };
    }

    // Get notifications
    const notifications = await Notification.find(filter)
      .populate('sender', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Mark read status for each notification
    const notificationsWithReadStatus = notifications.map(notification => ({
      ...notification,
      isRead: notification.readBy.some((read: any) => read.userId.toString() === user._id.toString())
    }));

    // Get total count
    const total = await Notification.countDocuments(filter);

    // Get unread count
    const unreadCount = await Notification.countDocuments({
      ...filter,
      'readBy.userId': { $ne: user._id }
    });

    return NextResponse.json({
      success: true,
      data: {
        notifications: notificationsWithReadStatus,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          count: notifications.length,
          totalNotifications: total
        },
        unreadCount
      }
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// Mark notification as read
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();

    // Get user from token
    const token = request.headers.get('authorization')?.replace('Bearer ', '') ||
                  request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get('notificationId');
    const markAllRead = searchParams.get('markAllRead') === 'true';

    if (markAllRead) {
      // Mark all notifications as read for this user
      await Notification.updateMany(
        {
          isActive: true,
          $or: [
            { 'recipients.sendToAll': true },
            { 'recipients.users': user._id },
            { 'recipients.roles': user.role }
          ],
          'readBy.userId': { $ne: user._id }
        },
        {
          $push: {
            readBy: {
              userId: typeof user._id === 'string' ? new (await import('mongoose')).Types.ObjectId(user._id) : user._id,
              readAt: new Date()
            }
          }
        }
      );

      return NextResponse.json({
        success: true,
        message: 'All notifications marked as read'
      });
    }

    if (!notificationId) {
      return NextResponse.json(
        { success: false, error: 'Notification ID is required' },
        { status: 400 }
      );
    }

    // Mark specific notification as read
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      return NextResponse.json(
        { success: false, error: 'Notification not found' },
        { status: 404 }
      );
    }

    // Check if already read by this user
    const alreadyRead = notification.readBy.some((read: any) => 
      read.userId.toString() === user._id.toString()
    );

    if (!alreadyRead) {
      // Ensure user._id is an ObjectId
      const mongoose = await import('mongoose');
      const userObjectId = typeof user._id === 'string' ? new mongoose.Types.ObjectId(user._id) : user._id;

      notification.readBy.push({
        userId: userObjectId,
        readAt: new Date()
      });
      await notification.save();
    }

    return NextResponse.json({
      success: true,
      message: 'Notification marked as read'
    });

  } catch (error) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to mark notification as read' },
      { status: 500 }
    );
  }
}
