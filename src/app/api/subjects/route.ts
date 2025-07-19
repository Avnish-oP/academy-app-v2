import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Subject from '@/models/Subject';
import Material from '@/models/Material';
import { Types } from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');

    if (!classId) {
      return NextResponse.json(
        { success: false, error: 'Class ID is required' },
        { status: 400 }
      );
    }

    // Validate ObjectId
    if (!Types.ObjectId.isValid(classId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid Class ID format' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get all active subjects for the class with material counts
    const subjects = await Subject.aggregate([
      { $match: { class: new Types.ObjectId(classId), isActive: true } },
      { $sort: { order: 1 } },
      {
        $lookup: {
          from: 'materials',
          localField: '_id',
          foreignField: 'subject',
          as: 'materials',
          pipeline: [{ $match: { isActive: true } }]
        }
      },
      {
        $addFields: {
          materialCount: { $size: '$materials' }
        }
      },
      {
        $project: {
          name: 1,
          description: 1,
          order: 1,
          materialCount: 1
        }
      }
    ]);

    return NextResponse.json({
      success: true,
      data: subjects,
    });
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subjects' },
      { status: 500 }
    );
  }
}
