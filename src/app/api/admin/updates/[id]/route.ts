import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Update from '@/models/Update';
import User from '@/models/User';
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
    const update = await Update.findById(id)
      .populate('author', 'name email')
      .lean();

    if (!update) {
      return NextResponse.json(
        { success: false, error: 'Update not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: update
    });

  } catch (error) {
    console.error('Error fetching update:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch update' },
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
      content,
      type,
      priority,
      isPublished,
      publishDate,
      expiryDate,
      targetAudience
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

    // Update the document
    const update = await Update.findByIdAndUpdate(
      id,
      {
        title,
        content,
        type: type || 'general',
        priority: priority || 'medium',
        isPublished: isPublished !== undefined ? isPublished : false,
        publishDate: publishDate ? new Date(publishDate) : new Date(),
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        targetAudience: targetAudience || { classes: [], sendToAll: true }
      },
      { new: true, runValidators: true }
    ).populate('author', 'name email');

    if (!update) {
      return NextResponse.json(
        { success: false, error: 'Update not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: update,
      message: 'Update updated successfully'
    });

  } catch (error) {
    console.error('Error updating update:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update update' },
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
    const update = await Update.findByIdAndDelete(id);

    if (!update) {
      return NextResponse.json(
        { success: false, error: 'Update not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Update deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting update:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete update' },
      { status: 500 }
    );
  }
}
