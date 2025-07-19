const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

// Define schemas directly in the script to avoid import issues
const ClassSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 50 },
  description: { type: String, required: true, maxlength: 300 },
  level: { type: Number, required: true, min: 1, max: 12, unique: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['Primary', 'Middle School', 'Secondary', 'Senior Secondary'] 
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const SubjectSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 100 },
  description: { type: String, required: true, maxlength: 300 },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  order: { type: Number, required: true, min: 1 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const MaterialSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 200 },
  description: { type: String, required: true, maxlength: 500 },
  type: { 
    type: String, 
    required: true, 
    enum: ['pdf', 'video', 'document', 'presentation'] 
  },
  driveLink: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  downloadCount: { type: Number, default: 0, min: 0 },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ['admin', 'student'], required: true },
  class: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Create models
const Class = mongoose.models.Class || mongoose.model('Class', ClassSchema);
const Subject = mongoose.models.Subject || mongoose.model('Subject', SubjectSchema);
const Material = mongoose.models.Material || mongoose.model('Material', MaterialSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function connectToDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

async function seedClassesSubjectsMaterials() {
  try {
    console.log('Starting class-subject-material seeding...');

    // Find an admin user to use as uploader
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.error('No admin user found. Please create an admin user first.');
      return;
    }

    // Clear existing data
    await Class.deleteMany({});
    await Subject.deleteMany({});
    await Material.deleteMany({});
    console.log('Cleared existing class-subject-material data');

    // Create classes 1-12
    const classes = [];
    for (let level = 1; level <= 12; level++) {
      let category;
      if (level <= 5) category = 'Primary';
      else if (level <= 8) category = 'Middle School';
      else if (level <= 10) category = 'Secondary';
      else category = 'Senior Secondary';

      const isHighSchool = level >= 9;
      const classData = {
        name: `Class ${level}`,
        description: isHighSchool 
          ? `Advanced ${level === 11 || level === 12 ? 'senior secondary' : 'secondary'} level with competitive exam preparation`
          : `${level <= 5 ? 'Primary' : 'Middle school'} level concepts and fundamentals`,
        level,
        category,
        isActive: true
      };

      const classDoc = new Class(classData);
      await classDoc.save();
      classes.push(classDoc);
      console.log(`Created ${classData.name}`);
    }

    // Create subjects for each class
    const subjects = [];
    for (const classDoc of classes) {
      const level = classDoc.level;
      const isHighSchool = level >= 9;

      const subjectData = [
        {
          name: 'Mathematics',
          description: isHighSchool ? 'Advanced mathematics with calculus and algebra' : 'Core mathematical concepts',
          order: 1
        },
        {
          name: isHighSchool ? 'Physics' : 'Science',
          description: isHighSchool ? 'Mechanics, thermodynamics, and modern physics' : 'Basic scientific concepts and experiments',
          order: 2
        }
      ];

      // Add high school specific subjects
      if (isHighSchool) {
        subjectData.push(
          {
            name: 'Chemistry',
            description: 'Organic, inorganic, and physical chemistry',
            order: 3
          },
          {
            name: 'Biology',
            description: 'Life sciences, botany, and zoology',
            order: 4
          },
          {
            name: 'Computer Science',
            description: 'Programming, algorithms, and computer applications',
            order: 7
          }
        );
      }

      // Common subjects for all classes
      subjectData.push(
        {
          name: 'English',
          description: isHighSchool ? 'Advanced literature and communication skills' : 'Grammar, vocabulary, and basic literature',
          order: isHighSchool ? 5 : 3
        },
        {
          name: 'Social Studies',
          description: isHighSchool ? 'History, geography, and political science' : 'Basic history, geography, and civics',
          order: isHighSchool ? 6 : 4
        }
      );

      // Add Hindi for classes 6 and above
      if (level >= 6) {
        subjectData.push({
          name: 'Hindi',
          description: 'Hindi literature and language skills',
          order: isHighSchool ? 8 : 5
        });
      }

      // Create subjects for this class
      for (const subData of subjectData) {
        const subject = new Subject({
          ...subData,
          class: classDoc._id,
          isActive: true
        });
        await subject.save();
        subjects.push(subject);
        console.log(`Created subject: ${subData.name} for ${classDoc.name}`);
      }
    }

    // Create sample materials for some subjects
    const materials = [];
    for (const subject of subjects.slice(0, 10)) { // Create materials for first 10 subjects
      const classDoc = classes.find(c => c._id.equals(subject.class));
      
      const materialData = [
        {
          title: `${subject.name} Textbook - ${classDoc.name}`,
          description: `Complete ${classDoc.name} ${subject.name} curriculum textbook`,
          type: 'pdf',
          driveLink: `https://drive.google.com/file/d/1ABC${Math.random().toString(36).substring(7)}/view?usp=sharing`,
          downloadCount: Math.floor(Math.random() * 200) + 50,
          uploadedBy: adminUser._id,
          subject: subject._id,
          class: classDoc._id,
          isActive: true
        },
        {
          title: `${subject.name} Practice Problems`,
          description: 'Comprehensive problem sets with detailed solutions',
          type: 'pdf',
          driveLink: `https://drive.google.com/file/d/1DEF${Math.random().toString(36).substring(7)}/view?usp=sharing`,
          downloadCount: Math.floor(Math.random() * 150) + 30,
          uploadedBy: adminUser._id,
          subject: subject._id,
          class: classDoc._id,
          isActive: true
        }
      ];

      // Add video material for some subjects
      if (Math.random() > 0.5) {
        materialData.push({
          title: `${subject.name} Video Lectures`,
          description: 'Interactive video lessons with detailed explanations',
          type: 'video',
          driveLink: `https://drive.google.com/file/d/1GHI${Math.random().toString(36).substring(7)}/view?usp=sharing`,
          downloadCount: Math.floor(Math.random() * 100) + 20,
          uploadedBy: adminUser._id,
          subject: subject._id,
          class: classDoc._id,
          isActive: true
        });
      }

      for (const matData of materialData) {
        const material = new Material(matData);
        await material.save();
        materials.push(material);
        console.log(`Created material: ${matData.title}`);
      }
    }

    console.log(`Seeding completed successfully!`);
    console.log(`Created:`);
    console.log(`- ${classes.length} classes`);
    console.log(`- ${subjects.length} subjects`);
    console.log(`- ${materials.length} materials`);

  } catch (error) {
    console.error('Error seeding classes, subjects, and materials:', error);
  }
}

async function main() {
  await connectToDatabase();
  await seedClassesSubjectsMaterials();
  await mongoose.connection.close();
  console.log('Database connection closed');
}

main().catch(console.error);
