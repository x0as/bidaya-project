const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGODB_URI || process.env.MongoDB;
const client = new MongoClient(uri);

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        await client.connect();
        const db = client.db('bidaya');
        const collection = db.collection('data');

        // Load data from local data.json
        const fs = require('fs');
        const path = require('path');
        const localDataPath = path.join(process.cwd(), 'public', 'data.json');
        const localData = JSON.parse(fs.readFileSync(localDataPath, 'utf8'));

        // Hash all passwords from the local data
        const hashedUsers = {};
        for (const [username, userData] of Object.entries(localData.users)) {
            const saltRounds = 12;
            const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
            hashedUsers[username] = {
                ...userData,
                password: hashedPassword
            };
        }

        const migratedData = {
            ...localData,
            users: hashedUsers,
            lastUpdated: new Date().toISOString(),
            migrated: true
        };

        // Save to MongoDB
        await collection.updateOne(
            { _id: 'main' },
            { $set: migratedData },
            { upsert: true }
        );

        res.status(200).json({
            success: true,
            message: 'Data migrated successfully',
            userCount: Object.keys(hashedUsers).length,
            lastUpdated: migratedData.lastUpdated
        });

    } catch (error) {
        console.error('Migration error:', error);
        res.status(500).json({
            success: false,
            error: 'Migration failed'
        });
    } finally {
        await client.close();
    }
};
