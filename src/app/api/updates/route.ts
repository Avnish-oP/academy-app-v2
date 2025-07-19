import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import Update from '@/models/Update';
import User from '@/models/User';

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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type');
    const priority = searchParams.get('priority');

    const skip = (page - 1) * limit;

    // Build filter
    const filter: any = {
      isPublished: true,
      $or: [
        { expiryDate: { $exists: false } },
        { expiryDate: null },
        { expiryDate: { $gt: new Date() } }
      ]
    };

    if (type && type !== 'all') {
      filter.type = type;
    }

    if (priority && priority !== 'all') {
      filter.priority = priority;
    }

    // Get updates with pagination
    const updates = await Update.find(filter)
      .populate('author', 'name email')
      .sort({ priority: -1, publishDate: -1 })
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
    console.error('Error fetching updates:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch updates' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const updateId = searchParams.get('updateId');

    if (!updateId) {
      return NextResponse.json(
        { success: false, error: 'Update ID is required' },
        { status: 400 }
      );
    }

    // Increment view count
    const update = await Update.findByIdAndUpdate(
      updateId,
      { $inc: { viewCount: 1 } },
      { new: true }
    );

    if (!update) {
      return NextResponse.json(
        { success: false, error: 'Update not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { viewCount: update.viewCount }
    });

  } catch (error) {
    console.error('Error updating view count:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update view count' },
      { status: 500 }
    );
  }
}
