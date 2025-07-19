import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Material from '@/models/Material';
import { Types } from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subjectId = searchParams.get('subjectId');
    const classId = searchParams.get('classId');

    // If neither subjectId nor classId is provided, return error
    if (!subjectId && !classId) {
      return NextResponse.json(
        { success: false, error: 'Subject ID or Class ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    let query: any = { isActive: true };

    // Filter by subject if provided
    if (subjectId) {
      if (!Types.ObjectId.isValid(subjectId)) {
        return NextResponse.json(
          { success: false, error: 'Invalid Subject ID format' },
          { status: 400 }
        );
      }
      query.subject = new Types.ObjectId(subjectId);
    }
    // Filter by class if provided (for home page)
    else if (classId) {
      if (!Types.ObjectId.isValid(classId)) {
        return NextResponse.json(
          { success: false, error: 'Invalid Class ID format' },
          { status: 400 }
        );
      }
      query.class = new Types.ObjectId(classId);
    }

    // Get all active materials
    const materials = await Material.find(query)
      .sort({ uploadDate: -1 })
      .populate('uploadedBy', 'name')
      .populate('subject', 'name')
      .lean();

    // Transform the data for frontend
    const transformedMaterials = materials.map(material => ({
      _id: material._id,
      title: material.title,
      description: material.description,
      subject: material.subject || 'Unknown Subject',
      classId: material.class,
      fileUrl: material.driveLink,
      fileName: material.title,
      uploadedBy: material.uploadedBy || 'Unknown',
      createdAt: material.uploadDate
    }));

    return NextResponse.json({
      success: true,
      data: transformedMaterials,
    });
  } catch (error) {
    console.error('Error fetching materials:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch materials' },
      { status: 500 }
    );
  }
}

// Increment download count
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const materialId = searchParams.get('materialId');

    if (!materialId) {
      return NextResponse.json(
        { success: false, error: 'Material ID is required' },
        { status: 400 }
      );
    }

    // Validate ObjectId
    if (!Types.ObjectId.isValid(materialId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid Material ID format' },
        { status: 400 }
      );
    }

    await connectDB();

    const material = await Material.findByIdAndUpdate(
      materialId,
      { $inc: { downloadCount: 1 } },
      { new: true }
    );

    if (!material) {
      return NextResponse.json(
        { success: false, error: 'Material not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { downloadCount: material.downloadCount },
    });
  } catch (error) {
    console.error('Error updating download count:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update download count' },
      { status: 500 }
    );
  }
}
