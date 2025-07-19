import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// GET /api/users - Get all users
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const course = searchParams.get('course');
    
    let query: any = {};
    if (role) query.role = role;
    if (course) query.enrolledCourses = course;
    
    const users = await User.find(query)
      .select('-password') // Exclude password from response
      .populate('enrolledCourses', 'title category')
      .sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const body = await request.json();
    const { 
      name, 
      email, 
      password, 
      role = 'student',
      phone,
      profile 
    } = body;
    
    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Name, email, and password are required',
        },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'User with this email already exists',
        },
        { status: 400 }
      );
    }
    
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Generate student ID for students
    let studentId;
    if (role === 'student') {
      const year = new Date().getFullYear();
      const lastStudent = await User.findOne({ role: 'student' })
        .sort({ createdAt: -1 });
      const sequence = lastStudent ? 
        parseInt(lastStudent.studentId?.slice(-4) || '0') + 1 : 1;
      studentId = `STU${year}${sequence.toString().padStart(4, '0')}`;
    }
    
    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      studentId,
      profile,
    });
    
    // Remove password from response
    const userResponse = user.toObject();
    
    return NextResponse.json(
      {
        success: true,
        data: userResponse,
        message: 'User created successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    // Handle duplicate email error
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email already exists',
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
