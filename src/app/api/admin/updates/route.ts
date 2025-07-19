import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import Update from '@/models/Update';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import { createUpdateNotification, extractMentions } from '@/lib/notifications';

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

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Ensure models are registered
    if (!mongoose.models.User) {
      require('@/models/User');
    }
    if (!mongoose.models.Update) {
      require('@/models/Update');
    }
    
    await verifyAdmin(request);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status'); // 'published', 'draft', 'all'

    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = {};

    if (status === 'published') {
      filter.isPublished = true;
    } else if (status === 'draft') {
      filter.isPublished = false;
    }
    // 'all' means no filter on isPublished

    // Get updates with pagination
    const updates = await Update.find(filter)
      .populate('author', 'name email')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Update.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: {
        updates,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          count: updates.length,
          totalUpdates: total
        }
      }
    });

  } catch (error) {
    console.error('Error fetching admin updates:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch updates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // Ensure models are registered
    if (!mongoose.models.User) {
      require('@/models/User');
    }
    if (!mongoose.models.Update) {
      require('@/models/Update');
    }
    
    const admin = await verifyAdmin(request);

    const body = await request.json();
    const {
      title,
      content,
      type,
      priority,
      isPublished,
      publishDate,
      expiryDate,
      targetAudience,
      mentions
    } = body;

    // Validation
    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: 'Title and content are required' },
        { status: 400 }
      );
    }

    if (title.length > 200) {
      return NextResponse.json(
        { success: false, error: 'Title cannot exceed 200 characters' },
        { status: 400 }
      );
    }

    if (content.length > 2000) {
      return NextResponse.json(
        { success: false, error: 'Content cannot exceed 2000 characters' },
        { status: 400 }
      );
    }

    // Extract mentions from content
    const mentionsFromContent = extractMentions(content);
    
    // Find mentioned users
    const mentionedUsers = await User.find({
      username: { $in: mentionsFromContent }
    });

    // Create update
    const update = new Update({
      title,
      content,
      type: type || 'general',
      priority: priority || 'medium',
      author: admin._id,
      isPublished: isPublished || false,
      publishDate: publishDate ? new Date(publishDate) : new Date(),
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      targetAudience: targetAudience || { classes: [], sendToAll: true },
      mentions: {
        users: mentionedUsers.map(user => user._id),
        usernames: mentionsFromContent
      }
    });

    await update.save();

    // Populate author data
    await update.populate('author', 'name email');

    // Create notifications if published
    if (isPublished) {
      await createUpdateNotification({
        _id: update._id.toString(),
        title: update.title,
        content: update.content,
        targetAudience: {
          ...update.targetAudience,
          classes: Array.isArray(update.targetAudience.classes)
            ? update.targetAudience.classes.map((c: any) => c.toString())
            : []
        },
        mentions: {
          users: update.mentions.users.map((id: any) => id.toString()),
          usernames: update.mentions.usernames
        },
        author: admin._id.toString()
      });
    }

    return NextResponse.json({
      success: true,
      data: update,
      message: 'Update created successfully'
    });

  } catch (error) {
    console.error('Error creating update:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create update' },
      { status: 500 }
    );
  }
}
