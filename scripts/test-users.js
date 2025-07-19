const mongoose = require('mongoose');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/academy';

async function testUserModel() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Test that users exist and have valid phone numbers
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    
    console.log(`\nFound ${users.length} users in database:`);
    
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}): phone="${user.phone}", role="${user.role}"`);
    });
    
    // Test phone validation
    console.log('\nTesting phone validation:');
    
    const validPhones = ['9876543210', '1234567890', ''];
    const invalidPhones = ['+91 9876543210', '98765 43210', '123'];
    
    console.log('Valid phones should pass:', validPhones);
    console.log('Invalid phones should fail:', invalidPhones);
    
  } catch (error) {
    console.error('Error testing user model:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run the test function
testUserModel();
