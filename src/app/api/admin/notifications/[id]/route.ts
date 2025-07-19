import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import Notification from '../../../../../models/Notification';
import User from '../../../../../models/User';
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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    await verifyAdmin(request);

    const { id } = await params;
    const notification = await Notification.findById(id)
      .populate('sender', 'name email')
      .lean();

    if (!notification) {
      return NextResponse.json(
        { success: false, error: 'Notification not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: notification
    });

  } catch (error) {
    console.error('Error fetching notification:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notification' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    await verifyAdmin(request);

    const { id } = await params;
    const body = await request.json();
    const {
      title,
      message,
      type,
      priority,
      recipients,
      channels,
      expiresAt,
      actionButton
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

    // Update the notification
    const notification = await Notification.findByIdAndUpdate(
      id,
      {
        title,
        message,
        type: type || 'info',
        priority: priority || 'medium',
        recipients: recipients || { sendToAll: true, users: [], roles: [], courses: [] },
        channels: channels || { inApp: true, push: true, email: false, sms: false },
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        actionButton: actionButton || null
      },
      { new: true, runValidators: true }
    ).populate('sender', 'name email');

    if (!notification) {
      return NextResponse.json(
        { success: false, error: 'Notification not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: notification,
      message: 'Notification updated successfully'
    });

  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update notification' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    await verifyAdmin(request);

    const { id } = await params;
    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
      return NextResponse.json(
        { success: false, error: 'Notification not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Notification deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete notification' },
      { status: 500 }
    );
  }
}
