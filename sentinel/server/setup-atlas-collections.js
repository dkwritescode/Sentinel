import mongoose from 'mongoose';
import User from './models/User.js';
import Activity from './models/Activity.js';
import Report from './models/Report.js';
import Mission from './models/Mission.js';

const setupAtlasCollections = async () => {
  try {
    console.log('🔄 Setting up MongoDB Atlas collections...');
    
    // Connect to MongoDB Atlas with the correct database
    const mongoUri = 'mongodb+srv://admin:admin123@cluster0.68cdadb.mongodb.net/sentinel?retryWrites=true&w=majority';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    
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
      type: 'System Initialization',
      details: 'Sentinel system started successfully',
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
      details: 'Test phishing report for collection creation',
      evidence: 'Test evidence',
      caseId: 'TEST-001'
    });
    await report.save();
    console.log('✅ Reports collection created');

    // Create Mission collection
    const missions = [
      {
        title: 'Phishing Defense Master',
        description: 'Complete 5 phishing detection challenges',
        difficulty: 'Easy',
        points: 100,
        total: 5,
        category: 'phishing',
        rewards: { points: 100, badge: 'Phishing Hunter' }
      },
      {
        title: 'Password Guardian',
        description: 'Generate and secure 10 strong passwords',
        difficulty: 'Medium',
        points: 150,
        total: 10,
        category: 'password',
        rewards: { points: 150, badge: 'Password Master' }
      },
      {
        title: 'Network Sentinel',
        description: 'Detect and report 3 network intrusions',
        difficulty: 'Hard',
        points: 200,
        total: 3,
        category: 'network',
        rewards: { points: 200, badge: 'Network Sentinel' }
      }
    ];
    
    await Mission.insertMany(missions);
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

    console.log('\n✅ MongoDB Atlas setup completed successfully!');
    console.log('🌐 You can now see the collections in your MongoDB Atlas dashboard');
    console.log('💡 Make sure to select the "sentinel" database in Atlas, not "admin"');
    
  } catch (error) {
    console.error('❌ Error setting up Atlas collections:', error.message);
    console.log('\n💡 Possible solutions:');
    console.log('1. Check your MongoDB Atlas connection string');
    console.log('2. Ensure your IP is whitelisted in Atlas');
    console.log('3. Verify your username and password are correct');
    console.log('4. Make sure you have write permissions to the database');
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB Atlas');
  }
};

setupAtlasCollections();


