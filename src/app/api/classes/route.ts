import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Class from '@/models/Class';
import Subject from '@/models/Subject';
import Material from '@/models/Material';

export async function GET() {
  try {
    await connectDB();

    // Get all active classes with subject and material counts
    const classes = await Class.aggregate([
      { $match: { isActive: true } },
      { $sort: { level: 1 } },
      {
        $lookup: {
          from: 'subjects',
          localField: '_id',
          foreignField: 'class',
          as: 'subjects',
          pipeline: [
            { $match: { isActive: true } },
            { $sort: { order: 1 } }
          ]
        }
      },
      {
        $lookup: {
          from: 'materials',
          localField: '_id',
          foreignField: 'class',
          as: 'materials',
          pipeline: [{ $match: { isActive: true } }]
        }
      },
      {
        $addFields: {
          subjectCount: { $size: '$subjects' },
          materialCount: { $size: '$materials' }
        }
      },
      {
        $project: {
          name: 1,
          description: 1,
          level: 1,
          category: 1,
          subjectCount: 1,
          materialCount: 1
        }
      }
    ]);

    return NextResponse.json({
      success: true,
      data: classes,
    });
  } catch (error) {
    console.error('Error fetching classes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch classes' },
      { status: 500 }
    );
  }
}
