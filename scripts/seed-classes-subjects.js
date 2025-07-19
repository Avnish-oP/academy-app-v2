const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/academy-app';

async function seedClassesAndSubjects() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db();
    
    console.log('Connected to MongoDB');
    
    // Clear existing classes and subjects
    await db.collection('classes').deleteMany({});
    await db.collection('subjects').deleteMany({});
    
    console.log('Cleared existing classes and subjects');
    
    // Create classes (Grade levels)
    const classes = [
      {
        name: 'Class 6',
        description: 'Sixth Grade - Foundation level',
        level: 6,
        category: 'Middle School',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Class 7',
        description: 'Seventh Grade - Intermediate level',
        level: 7,
        category: 'Middle School',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Class 8',
        description: 'Eighth Grade - Advanced middle school',
        level: 8,
        category: 'Middle School',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Class 9',
        description: 'Ninth Grade - High school foundation',
        level: 9,
        category: 'Secondary',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Class 10',
        description: 'Tenth Grade - Board exam preparation',
        level: 10,
        category: 'Secondary',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Class 11',
        description: 'Eleventh Grade - Higher secondary foundation',
        level: 11,
        category: 'Senior Secondary',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Class 12',
        description: 'Twelfth Grade - Higher secondary completion',
        level: 12,
        category: 'Senior Secondary',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    const insertedClasses = await db.collection('classes').insertMany(classes);
    console.log(`Created ${insertedClasses.insertedCount} classes`);
    
    // Create subjects for each class
    const subjects = [
      // Class 6 Subjects
      {
        name: 'Mathematics',
        description: 'Basic arithmetic, geometry, and algebra',
        order: 1,
        class: insertedClasses.insertedIds[0],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Science',
        description: 'Basic physics, chemistry, and biology concepts',
        order: 2,
        class: insertedClasses.insertedIds[0],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'English',
        description: 'Grammar, literature, and composition',
        order: 3,
        class: insertedClasses.insertedIds[0],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Social Studies',
        description: 'History, geography, and civics',
        order: 4,
        class: insertedClasses.insertedIds[0],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // Class 7 Subjects
      {
        name: 'Mathematics',
        description: 'Advanced arithmetic, algebra, and geometry',
        order: 1,
        class: insertedClasses.insertedIds[1],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Science',
        description: 'Physics, chemistry, and biology',
        order: 2,
        class: insertedClasses.insertedIds[1],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'English',
        description: 'Advanced grammar and literature',
        order: 3,
        class: insertedClasses.insertedIds[1],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Social Studies',
        description: 'History, geography, and political science',
        order: 4,
        class: insertedClasses.insertedIds[1],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // Class 8 Subjects  
      {
        name: 'Mathematics',
        description: 'Algebra, geometry, and mensuration',
        order: 1,
        class: insertedClasses.insertedIds[2],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Science',
        description: 'Physics, chemistry, and biology',
        order: 2,
        class: insertedClasses.insertedIds[2],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'English',
        description: 'Literature and creative writing',
        order: 3,
        class: insertedClasses.insertedIds[2],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Social Studies',
        description: 'Indian history and geography',
        order: 4,
        class: insertedClasses.insertedIds[2],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // Class 9 Subjects
      {
        name: 'Mathematics',
        description: 'Algebra, geometry, statistics',
        order: 1,
        class: insertedClasses.insertedIds[3],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Physics',
        description: 'Motion, force, energy, and waves',
        order: 2,
        class: insertedClasses.insertedIds[3],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Chemistry',
        description: 'Atoms, molecules, and chemical reactions',
        order: 3,
        class: insertedClasses.insertedIds[3],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Biology',
        description: 'Cell structure, reproduction, and heredity',
        order: 4,
        class: insertedClasses.insertedIds[3],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'English',
        description: 'Literature, grammar, and writing skills',
        order: 5,
        class: insertedClasses.insertedIds[3],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // Class 10 Subjects
      {
        name: 'Mathematics',
        description: 'Real numbers, algebra, coordinate geometry, trigonometry',
        order: 1,
        class: insertedClasses.insertedIds[4],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Physics',
        description: 'Light, electricity, and magnetic effects',
        order: 2,
        class: insertedClasses.insertedIds[4],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Chemistry',
        description: 'Acids, bases, metals, and carbon compounds',
        order: 3,
        class: insertedClasses.insertedIds[4],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Biology',
        description: 'Life processes, heredity, and evolution',
        order: 4,
        class: insertedClasses.insertedIds[4],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'English',
        description: 'Board exam preparation - literature and language',
        order: 5,
        class: insertedClasses.insertedIds[4],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // Class 11 Subjects
      {
        name: 'Mathematics',
        description: 'Sets, functions, trigonometry, and limits',
        order: 1,
        class: insertedClasses.insertedIds[5],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Physics',
        description: 'Mechanics, thermodynamics, and oscillations',
        order: 2,
        class: insertedClasses.insertedIds[5],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Chemistry',
        description: 'Atomic structure, chemical bonding, and organic chemistry basics',
        order: 3,
        class: insertedClasses.insertedIds[5],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Biology',
        description: 'Plant and animal kingdom, cell biology',
        order: 4,
        class: insertedClasses.insertedIds[5],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
      // Class 12 Subjects
      {
        name: 'Mathematics',
        description: 'Calculus, vectors, probability, and linear programming',
        order: 1,
        class: insertedClasses.insertedIds[6],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Physics',
        description: 'Electrostatics, magnetism, optics, and modern physics',
        order: 2,
        class: insertedClasses.insertedIds[6],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Chemistry',
        description: 'Solutions, electrochemistry, and coordination compounds',
        order: 3,
        class: insertedClasses.insertedIds[6],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Biology',
        description: 'Reproduction, genetics, and biotechnology',
        order: 4,
        class: insertedClasses.insertedIds[6],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    const insertedSubjects = await db.collection('subjects').insertMany(subjects);
    console.log(`Created ${insertedSubjects.insertedCount} subjects`);
    
    console.log('\n✅ Database seeded successfully!');
    console.log('\nCreated classes:');
    classes.forEach((cls, index) => {
      console.log(`  - ${cls.name}: ${cls.description}`);
    });
    
    console.log('\n📚 Now you can upload materials by:');
    console.log('1. Going to /admin/courses');
    console.log('2. Selecting a class');
    console.log('3. Selecting a subject');
    console.log('4. Clicking "Add Material" and providing a Google Drive link');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
}

// Run the seeder
seedClassesAndSubjects().catch(console.error);
