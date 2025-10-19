import mongoose from 'mongoose';

const setupLocalMongoDB = async () => {
  try {
    console.log('🔄 Setting up local MongoDB connection...');
    
    // Try local MongoDB first
    const localUri = 'mongodb://localhost:27017/sentinel';
    await mongoose.connect(localUri);
    console.log('✅ Connected to local MongoDB');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    
    // Create collections by inserting sample documents
    console.log('📝 Creating collections...');

    // Create a simple test collection
    const testCollection = mongoose.connection.db.collection('test');
    await testCollection.insertOne({ 
      message: 'Sentinel database initialized', 
      timestamp: new Date(),
      version: '1.0.0'
    });
    console.log('✅ Test collection created');

    // Create users collection
    const usersCollection = mongoose.connection.db.collection('users');
    await usersCollection.insertOne({
      username: 'admin',
      email: 'admin@sentinel.com',
      rank: 'Diamond',
      totalPoints: 1000,
      securityScore: 95,
      createdAt: new Date()
    });
    console.log('✅ Users collection created');

    // Create activities collection
    const activitiesCollection = mongoose.connection.db.collection('activities');
    await activitiesCollection.insertOne({
      type: 'System Initialization',
      details: 'Database setup completed',
      severity: 'Low',
      risk: 'Low',
      createdAt: new Date()
    });
    console.log('✅ Activities collection created');

    // Create reports collection
    const reportsCollection = mongoose.connection.db.collection('reports');
    await reportsCollection.insertOne({
      target: 'cybercrime',
      threatType: 'phishing',
      severity: 'High',
      details: 'Test report for collection creation',
      caseId: 'TEST-001',
      createdAt: new Date()
    });
    console.log('✅ Reports collection created');

    // Create missions collection
    const missionsCollection = mongoose.connection.db.collection('missions');
    await missionsCollection.insertOne({
      title: 'Welcome Mission',
      description: 'Complete your first security challenge',
      difficulty: 'Easy',
      points: 50,
      category: 'general',
      createdAt: new Date()
    });
    console.log('✅ Missions collection created');

    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n📁 All collections in database:');
    collections.forEach(col => {
      console.log(`  - ${col.name}`);
    });

    // Count documents in each collection
    console.log('\n📊 Document counts:');
    console.log(`  - test: ${await testCollection.countDocuments()}`);
    console.log(`  - users: ${await usersCollection.countDocuments()}`);
    console.log(`  - activities: ${await activitiesCollection.countDocuments()}`);
    console.log(`  - reports: ${await reportsCollection.countDocuments()}`);
    console.log(`  - missions: ${await missionsCollection.countDocuments()}`);

    console.log('\n✅ Local MongoDB setup completed successfully!');
    console.log('💡 You can now use this local database for development');
    console.log('🌐 To use MongoDB Atlas, get the correct connection string from your Atlas dashboard');
    
  } catch (error) {
    console.error('❌ Error setting up local MongoDB:', error.message);
    console.log('\n💡 To fix this:');
    console.log('1. Install MongoDB locally: https://www.mongodb.com/try/download/community');
    console.log('2. Start MongoDB service');
    console.log('3. Or get the correct MongoDB Atlas connection string');
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('👋 Disconnected from MongoDB');
    }
  }
};

setupLocalMongoDB();
