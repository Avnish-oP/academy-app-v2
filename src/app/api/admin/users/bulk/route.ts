import { NextRequest, NextResponse } from 'next/server';
import connectDB from '../../../../../lib/mongodb';
import User from '../../../../../models/User';
import Class from '../../../../../models/Class';
import { verifyToken } from '../../../../../lib/auth';
import bcrypt from 'bcryptjs';

// Bulk upload users from CSV
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authResult = await verifyToken(request);
    if (!authResult.success || authResult.user?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin access required.' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 }
      );
    }

    if (file.type !== 'text/csv') {
      return NextResponse.json(
        { success: false, error: 'File must be a CSV' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get all classes for name-to-ID mapping
    const classes = await Class.find({}, { name: 1, _id: 1 });
    const classMap = new Map();
    classes.forEach(cls => {
      classMap.set(cls.name.toLowerCase(), cls._id.toString());
    });

    // Read CSV content
    const csvText = await file.text();
    const lines = csvText.split('\n').map(line => line.trim()).filter(line => line);
    
    if (lines.length < 2) {
      return NextResponse.json(
        { success: false, error: 'CSV file must have at least a header and one data row' },
        { status: 400 }
      );
    }

    // Parse header
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const requiredHeaders = ['name', 'username', 'email', 'password'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    
    if (missingHeaders.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required columns: ${missingHeaders.join(', ')}` },
        { status: 400 }
      );
    }

    // Parse data rows
    const results = {
      successful: 0,
      failed: 0,
      errors: [] as string[]
    };

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(',').map(v => v.trim());
        
        if (values.length !== headers.length) {
          results.failed++;
          results.errors.push(`Row ${i + 1}: Column count mismatch`);
          continue;
        }

        // Create user object from CSV row
        const userData: any = {};
        headers.forEach((header, index) => {
          userData[header] = values[index];
        });

        // Validate required fields
        if (!userData.name || !userData.username || !userData.email || !userData.password) {
          results.failed++;
          results.errors.push(`Row ${i + 1}: Missing required fields`);
          continue;
        }

        // Check if username or email already exists
        const existingUser = await User.findOne({
          $or: [
            { username: userData.username },
            { email: userData.email }
          ]
        });

        if (existingUser) {
          results.failed++;
          results.errors.push(`Row ${i + 1}: Username or email already exists`);
          continue;
        }

        // Map class name to class ID if provided
        let classId = null;
        if (userData.classid) {
          const className = userData.classid.toLowerCase();
          classId = classMap.get(className);
          if (!classId) {
            results.failed++;
            results.errors.push(`Row ${i + 1}: Class "${userData.classid}" not found`);
            continue;
          }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(userData.password, 12);

        // Create user
        const newUser = new User({
          name: userData.name,
          username: userData.username,
          email: userData.email,
          phone: userData.phone || undefined,
          role: 'student', // Bulk upload only creates students
          classId: classId || undefined,
          password: hashedPassword,
        });

        await newUser.save();
        results.successful++;

      } catch (error) {
        results.failed++;
        results.errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Bulk upload completed. ${results.successful} users created, ${results.failed} failed.`,
      successful: results.successful,
      failed: results.failed,
      errors: results.errors
    });

  } catch (error) {
    console.error('Bulk upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Bulk upload failed' },
      { status: 500 }
    );
  }
}
