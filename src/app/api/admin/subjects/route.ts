import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Subject from '@/models/Subject';
import Material from '@/models/Material';
import { Types } from 'mongoose';

// Create new subject
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, order, class: classId } = body;

    if (!name || !description || !order || !classId) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (!Types.ObjectId.isValid(classId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid class ID' },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if subject with same order already exists for this class
    const existingSubject = await Subject.findOne({ 
      class: new Types.ObjectId(classId), 
      order 
    });

    if (existingSubject) {
      // Shift existing subjects order up
      await Subject.updateMany(
        { 
          class: new Types.ObjectId(classId), 
          order: { $gte: order }
        },
        { $inc: { order: 1 } }
      );
    }

    const subject = new Subject({
      name,
      description,
      order,
      class: new Types.ObjectId(classId),
      isActive: true
    });

    await subject.save();

    return NextResponse.json({
      success: true,
      data: subject,
    });
  } catch (error) {
    console.error('Error creating subject:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create subject' },
      { status: 500 }
    );
  }
}
