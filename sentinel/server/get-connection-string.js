console.log(`
🔧 MongoDB Atlas Connection String Setup
========================================

To get your correct MongoDB Atlas connection string:

1. Go to your MongoDB Atlas dashboard
2. Click on "Connect" button for your Cluster0
3. Choose "Connect your application"
4. Select "Node.js" as driver
5. Copy the connection string

The connection string should look like:
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<database>?retryWrites=true&w=majority

Replace:
- <username> with your MongoDB Atlas username
- <password> with your MongoDB Atlas password  
- <database> with 'sentinel' (or any database name you want to use)

Example:
mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/sentinel?retryWrites=true&w=majority

Once you have the correct connection string, update the MONGO_URI in your .env file or directly in the code.

Current connection string being used:
mongodb+srv://admin:admin123@cluster0.68cdadb.mongodb.net/sentinel?retryWrites=true&w=majority

This might be incorrect because:
1. The cluster name might be different
2. The username/password might be different
3. The cluster might not be accessible from your current IP

Please check your MongoDB Atlas dashboard for the correct connection details.
`);
