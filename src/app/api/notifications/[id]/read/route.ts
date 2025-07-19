import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import Notification from '../../../../../models/Notification';
import User from '../../../../../models/User';
import jwt from 'jsonwebtoken';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const { id } = await params;
    const notificationId = id;

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
