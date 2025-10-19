import mongoose from 'mongoose';

const testConnection = async () => {
  try {
    console.log('🔄 Testing MongoDB Atlas connection...');
    
    // Test with different connection strings
    const connectionStrings = [
      'mongodb+srv://admin:admin123@cluster0.68cdadb.mongodb.net/sentinel?retryWrites=true&w=majority&authSource=admin',
      'mongodb+srv://admin:admin123@cluster0.68cdadb.mongodb.net/sentinel?retryWrites=true&w=majority',
      'mongodb+srv://admin:admin123@cluster0.68cdadb.mongodb.net/?retryWrites=true&w=majority'
    ];

    for (let i = 0; i < connectionStrings.length; i++) {
      console.log(`\n--- Testing connection string ${i + 1} ---`);
      console.log(`Connection: ${connectionStrings[i]}`);
      
      try {
        await mongoose.connect(connectionStrings[i]);
        console.log('✅ Connected successfully');
        console.log(`📊 Database name: ${mongoose.connection.name}`);
        console.log(`🏠 Host: ${mongoose.connection.host}`);
        
        // List databases
        const adminDb = mongoose.connection.db.admin();
        const dbs = await adminDb.listDatabases();
        console.log('📁 Available databases:');
        dbs.databases.forEach(db => {
          console.log(`  - ${db.name}`);
        });
        
        // Try to create a simple collection in the sentinel database
        const sentinelDb = mongoose.connection.useDb('sentinel');
        const testCollection = sentinelDb.collection('test');
        await testCollection.insertOne({ test: 'data', timestamp: new Date() });
        console.log('✅ Successfully created test document in sentinel database');
        
        // List collections in sentinel database
        const collections = await sentinelDb.listCollections().toArray();
        console.log('📁 Collections in sentinel database:');
        collections.forEach(col => {
          console.log(`  - ${col.name}`);
        });
        
        await mongoose.disconnect();
        console.log('👋 Disconnected');
        break; // If successful, break out of the loop
        
      } catch (error) {
        console.log(`❌ Connection failed: ${error.message}`);
        if (mongoose.connection.readyState === 1) {
          await mongoose.disconnect();
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
};

testConnection();
