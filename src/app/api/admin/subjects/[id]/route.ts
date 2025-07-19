import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Subject from '@/models/Subject';
import Material from '@/models/Material';
import { Types } from 'mongoose';

// Update subject
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, order } = body;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid subject ID' },
        { status: 400 }
      );
    }

    if (!name || !description || !order) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const subject = await Subject.findById(id);
    if (!subject) {
      return NextResponse.json(
        { success: false, error: 'Subject not found' },
        { status: 404 }
      );
    }

    // If order changed, reorder other subjects
    if (subject.order !== order) {
      if (order > subject.order) {
        // Moving down - shift subjects between old and new position up
        await Subject.updateMany(
          { 
            class: subject.class,
            order: { $gt: subject.order, $lte: order }
          },
          { $inc: { order: -1 } }
        );
      } else {
        // Moving up - shift subjects between new and old position down
        await Subject.updateMany(
          { 
            class: subject.class,
            order: { $gte: order, $lt: subject.order }
          },
          { $inc: { order: 1 } }
        );
      }
    }

    const updatedSubject = await Subject.findByIdAndUpdate(
      id,
      { name, description, order },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      data: updatedSubject,
    });
  } catch (error) {
    console.error('Error updating subject:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update subject' },
      { status: 500 }
    );
  }
}

// Delete subject
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid subject ID' },
        { status: 400 }
      );
    }

    await connectDB();

    const subject = await Subject.findById(id);
    if (!subject) {
      return NextResponse.json(
        { success: false, error: 'Subject not found' },
        { status: 404 }
      );
    }

    // Delete all materials for this subject
    await Material.deleteMany({ subject: new Types.ObjectId(id) });

    // Delete the subject
    await Subject.findByIdAndDelete(id);

    // Reorder remaining subjects
    await Subject.updateMany(
      { 
        class: subject.class,
        order: { $gt: subject.order }
      },
      { $inc: { order: -1 } }
    );

    return NextResponse.json({
      success: true,
      message: 'Subject and associated materials deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting subject:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete subject' },
      { status: 500 }
    );
  }
}
