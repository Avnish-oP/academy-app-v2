import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Material from '@/models/Material';
import User from '@/models/User';
import { Types } from 'mongoose';

// Create new material
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, type, driveLink, subjectId, classId } = body;

    if (!title || !description || !type || !driveLink || !subjectId || !classId) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(subjectId) || !Types.ObjectId.isValid(classId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid subject or class ID' },
        { status: 400 }
      );
    }

    // Validate Google Drive link
    if (!/^https:\/\/(drive\.google\.com|docs\.google\.com)/.test(driveLink)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid Google Drive link' },
        { status: 400 }
      );
    }

    await connectDB();

    // For now, we'll use the first admin user as the uploader
    // In a real app, you'd get this from the authenticated user
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: 'No admin user found' },
        { status: 400 }
      );
    }

    // Create material record
    const material = new Material({
      title,
      description,
      type,
      driveLink,
      uploadedBy: adminUser._id,
      subject: new Types.ObjectId(subjectId),
      class: new Types.ObjectId(classId),
      isActive: true
    });

    await material.save();

    return NextResponse.json({
      success: true,
      data: material,
    });
  } catch (error) {
    console.error('Error creating material:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create material' },
      { status: 500 }
    );
  }
}
