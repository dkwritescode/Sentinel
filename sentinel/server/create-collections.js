import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Activity from './models/Activity.js';
import Report from './models/Report.js';
import Mission from './models/Mission.js';

dotenv.config();

const createCollections = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://admin:admin123@cluster0.68cdadb.mongodb.net/sentinel?retryWrites=true&w=majority&authSource=admin';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Create collections by inserting sample documents
    console.log('📝 Creating collections...');

    // Create User collection
    const user = new User({
      username: 'admin',
      email: 'admin@sentinel.com',
      password: 'hashedpassword',
      rank: 'Diamond',
      totalPoints: 1000,
      securityScore: 95,
      learningProgress: 100
    });
    await user.save();
    console.log('✅ Users collection created');

    // Create Activity collection
    const activity = new Activity({
      type: 'System Test',
      details: 'Database initialization test',
      threatType: 'other',
      severity: 'Low',
      risk: 'Low'
    });
    await activity.save();
    console.log('✅ Activities collection created');

    // Create Report collection
    const report = new Report({
      target: 'cybercrime',
      threatType: 'phishing',
      severity: 'High',
      details: 'Test phishing report',
      evidence: 'Test evidence',
      caseId: 'TEST-12345678'
    });
    await report.save();
    console.log('✅ Reports collection created');

    // Create Mission collection
    const mission = new Mission({
      title: 'Test Mission',
      description: 'Test mission for collection creation',
      difficulty: 'Easy',
      points: 50,
      total: 1,
      category: 'general',
      rewards: { points: 50, badge: 'Test Badge' }
    });
    await mission.save();
    console.log('✅ Missions collection created');

    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📁 All collections in database:');
    collections.forEach(col => {
      console.log(`  - ${col.name}`);
    });

    // Count documents in each collection
    console.log('\n📊 Document counts:');
    console.log(`  - Users: ${await User.countDocuments()}`);
    console.log(`  - Activities: ${await Activity.countDocuments()}`);
    console.log(`  - Reports: ${await Report.countDocuments()}`);
    console.log(`  - Missions: ${await Mission.countDocuments()}`);

    console.log('\n✅ All collections created successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
};

createCollections();
