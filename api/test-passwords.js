const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = process.env.MongoDB;

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const client = new MongoClient(uri);
        await client.connect();
        const db = client.db('bidaya');
        const collection = db.collection('data');

        // Get current data
        const data = await collection.findOne({ _id: 'main' });
        
        if (!data) {
            throw new Error('No data found');
        }

        // Hash passwords properly
        const correctPasswords = {
            "Founder": await bcrypt.hash("bidaya2025", 12),
            "Hamza": await bcrypt.hash("@4729", 12),
            "Rama": await bcrypt.hash("@8351", 12),
            "Yusuf": await bcrypt.hash("@6194", 12),
            "Sim": await bcrypt.hash("@2847", 12),
            "Ibrahim": await bcrypt.hash("@9563", 12)
        };

        // Update each user's password
        for (const [username, hashedPassword] of Object.entries(correctPasswords)) {
            if (data.users[username]) {
                data.users[username].password = hashedPassword;
            }
        }

        // Save back to database
        await collection.updateOne(
            { _id: 'main' },
            { $set: data },
            { upsert: true }
        );

        await client.close();

        // Test the founder password to confirm it works
        const testPassword = await bcrypt.compare('bidaya2025', correctPasswords.Founder);

        res.status(200).json({ 
            success: true,
            message: 'Passwords fixed successfully!',
            usersUpdated: Object.keys(correctPasswords),
            testResult: `Founder password test: ${testPassword}`,
            credentials: {
                "Founder": "bidaya2025",
                "Hamza": "@4729", 
                "Rama": "@8351",
                "Yusuf": "@6194",
                "Sim": "@2847",
                "Ibrahim": "@9563"
            }
        });

    } catch (error) {
        console.error('Fix passwords error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
};