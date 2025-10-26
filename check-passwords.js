const { MongoClient } = require('mongodb');

// You need to replace this with your actual MongoDB connection string
const uri = process.env.MONGODB_URI || 'REPLACE_WITH_YOUR_MONGODB_CONNECTION_STRING';

async function showPasswords() {
    if (uri === 'REPLACE_WITH_YOUR_MONGODB_CONNECTION_STRING') {
        console.log('❌ MONGODB CONNECTION STRING NOT SET');
        console.log('');
        console.log('🔧 To fix this, you need to:');
        console.log('1. Get your MongoDB connection string from MongoDB Atlas');
        console.log('2. Run this command with your connection string:');
        console.log('');
        console.log('   $env:MONGODB_URI = "mongodb+srv://username:password@cluster.mongodb.net/dbname"');
        console.log('   node check-passwords.js');
        console.log('');
        console.log('🌐 Or you can check passwords by logging into your admin panel at:');
        console.log('   https://project-bidaya-20-og0v29nst-x0as-projects.vercel.app/admin.html');
        console.log('');
        console.log('💡 Your admin panel is already working, so you have the connection string');
        console.log('   somewhere in your Vercel environment variables!');
        return;
    }

    const client = new MongoClient(uri);
    
    try {
        console.log('🔗 Connecting to MongoDB...');
        await client.connect();
        
        const db = client.db('bidaya');
        const collection = db.collection('data');

        const data = await collection.findOne({ _id: 'main' });
        
        if (!data || !data.users) {
            console.log('❌ NO USER DATA FOUND IN MONGODB');
            console.log('📝 Database exists but no user data found');
            console.log('💡 Try logging into the admin panel first to initialize user data');
            return;
        }

        console.log('\n🔐 CURRENT PASSWORDS IN MONGODB:');
        console.log('================================');
        
        for (const [username, userData] of Object.entries(data.users)) {
            console.log(`\n👤 Username: ${username}`);
            console.log(`🔑 Password: ${userData.password}`);
            console.log(`📋 Role: ${userData.role}`);
            if (userData.department) {
                console.log(`🏢 Department: ${userData.department}`);
            }
            console.log(`🔒 Type: ${userData.password && userData.password.startsWith('$2') ? 'Hashed (bcrypt)' : 'Plain text'}`);
            console.log('------------------------');
        }
        
        console.log(`\n📅 Last Updated: ${data.lastUpdated || 'Unknown'}`);
        console.log(`📊 Total Users: ${Object.keys(data.users).length}`);

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.message.includes('authentication')) {
            console.log('💡 Check your MongoDB username and password in the connection string');
        }
    } finally {
        await client.close();
    }
}

showPasswords();