import mongoose from 'mongoose';
import User from './models/User.js';
import Activity from './models/Activity.js';
import Report from './models/Report.js';
import Mission from './models/Mission.js';

const testDatabaseConnection = async () => {
  try {
    console.log('🔄 Testing database connection...');
    
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/sentinel');
    console.log('✅ Connected to MongoDB');
    
    // Test each model
    console.log('\n📊 Testing models...');
    
    // Test User model
    const userCount = await User.countDocuments();
    console.log(`✅ Users: ${userCount} documents`);
    
    // Test Activity model
    const activityCount = await Activity.countDocuments();
    console.log(`✅ Activities: ${activityCount} documents`);
    
    // Test Report model
    const reportCount = await Report.countDocuments();
    console.log(`✅ Reports: ${reportCount} documents`);
    
    // Test Mission model
    const missionCount = await Mission.countDocuments();
    console.log(`✅ Missions: ${missionCount} documents`);
    
    // Test creating a new mission
    console.log('\n📝 Testing mission creation...');
    const newMission = new Mission({
      title: 'Test Mission',
      description: 'Testing mission creation',
      difficulty: 'Easy',
      points: 50,
      total: 1,
      category: 'general'
    });
    
    await newMission.save();
    console.log('✅ Mission created successfully');
    
    // List all missions
    const missions = await Mission.find();
    console.log(`📋 Total missions: ${missions.length}`);
    missions.forEach(mission => {
      console.log(`  - ${mission.title} (${mission.difficulty})`);
    });
    
    console.log('\n✅ Database connection test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
};

testDatabaseConnection();
