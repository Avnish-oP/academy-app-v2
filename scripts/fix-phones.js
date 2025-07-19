const mongoose = require('mongoose');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/academy';

async function fixPhoneNumbers() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update all users with invalid phone numbers
    const result = await mongoose.connection.db.collection('users').updateMany(
      {
        $or: [
          { phone: { $regex: /^\+91/ } }, // Phone numbers starting with +91
          { phone: { $regex: /\s/ } },    // Phone numbers with spaces
          { phone: { $not: /^[0-9]{10}$/ } } // Not exactly 10 digits
        ]
      },
      [
        {
          $set: {
            phone: {
              $cond: {
                if: { $eq: ["$email", "admin@academy.com"] },
                then: "9876543210",
                else: {
                  $cond: {
                    if: { $eq: ["$email", "student@academy.com"] },
                    then: "9876512345",
                    else: ""
                  }
                }
              }
            }
          }
        }
      ]
    );

    console.log(`Updated ${result.modifiedCount} users with fixed phone numbers`);
    
  } catch (error) {
    console.error('Error fixing phone numbers:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the fix function
fixPhoneNumbers();
