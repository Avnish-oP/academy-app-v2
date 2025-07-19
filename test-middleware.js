const jwt = require('jsonwebtoken');

// Test the JWT token from our login
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODZkM2U1NWJkMjA2ZTc0OWQ4YjQ3MTgiLCJlbWFpbCI6ImFkbWluQGFjYWRlbXkuY29tIiwicm9sZSI6ImFkbWluIiwibmFtZSI6IkFkbWluIFVzZXIiLCJpYXQiOjE3NTIwMDA1NTMsImV4cCI6MTc1MjYwNTM1M30.iBplCDSqDTEXnZEnHrppxFWVvkUZAsX8uWhoB0l73fw';

require('dotenv').config({ path: '.env.local' });

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

console.log('JWT_SECRET:', JWT_SECRET);

try {
  const decoded = jwt.verify(token, JWT_SECRET);
  console.log('Token verified successfully:', decoded);
} catch (error) {
  console.log('Token verification failed:', error.message);
}
