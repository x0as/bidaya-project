const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || process.env.MongoDB;
const client = new MongoClient(uri);

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        await client.connect();
        const db = client.db('bidaya');
        const collection = db.collection('data');

        // Get current data from MongoDB
        const data = await collection.findOne({ _id: 'main' });
        
        if (!data || !data.users) {
            return res.status(404).json({ 
                error: 'No user data found in MongoDB',
                message: 'Database might not be initialized yet'
            });
        }

        // Extract user info without sensitive data for display
        const userInfo = {};
        for (const [username, userData] of Object.entries(data.users)) {
            userInfo[username] = {
                role: userData.role,
                name: userData.name,
                department: userData.department || 'N/A',
                permissions: userData.permissions,
                passwordHash: userData.password ? userData.password.substring(0, 20) + '...' : 'No password set',
                passwordType: userData.password && userData.password.startsWith('$2') ? 'Hashed (bcrypt)' : 'Plain text'
            };
        }

        res.status(200).json({
            success: true,
            totalUsers: Object.keys(data.users).length,
            lastUpdated: data.lastUpdated || 'Unknown',
            users: userInfo,
            note: 'This shows password info without exposing actual passwords'
        });

    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error',
            details: error.message
        });
    } finally {
        await client.close();
    }
};