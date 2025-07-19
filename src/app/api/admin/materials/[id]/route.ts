import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Material from '@/models/Material';
import { Types } from 'mongoose';

// Delete material
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid material ID' },
        { status: 400 }
      );
    }

    await connectDB();

    const material = await Material.findById(id);
    if (!material) {
      return NextResponse.json(
        { success: false, error: 'Material not found' },
        { status: 404 }
      );
    }

    // Delete from database
    await Material.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Material deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting material:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete material' },
      { status: 500 }
    );
  }
}
