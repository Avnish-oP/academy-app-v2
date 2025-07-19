import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // This route is deprecated. Use /admin/courses page for material management
  return NextResponse.json(
    { 
      error: 'This upload method is deprecated. Please use the Admin Courses page to manage materials.',
      redirectTo: '/admin/courses'
    },
    { status: 400 }
  );
}

export async function GET(request: NextRequest) {
  // Redirect to proper interface
  return NextResponse.json(
    { 
      message: 'Use the Admin Courses page to manage materials.',
      redirectTo: '/admin/courses'
    }
  );
}
