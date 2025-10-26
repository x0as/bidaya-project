const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = process.env.MongoDB;
const client = new MongoClient(uri);

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        await client.connect();
        const db = client.db('bidaya');
        const collection = db.collection('data');

        // Get current data
        const data = await collection.findOne({ _id: 'main' });
        
        if (!data) {
            return res.status(404).json({ error: 'No data found' });
        }

        // Set the correct passwords
        const passwords = {
            "Founder": "bidaya2025",
            "Hamza": "@4729",
            "Rama": "@8351", 
            "Yusuf": "@6194",
            "Sim": "@2847",
            "Ibrahim": "@9563"
        };

        // Hash passwords and update users
        for (const [username, plainPassword] of Object.entries(passwords)) {
            if (data.users[username]) {
                data.users[username].password = await bcrypt.hash(plainPassword, 12);
            }
        }

        // Update the database
        await collection.updateOne(
            { _id: 'main' },
            { $set: data }
        );

        res.status(200).json({ 
            success: true,
            message: 'Passwords updated successfully',
            usersUpdated: Object.keys(passwords)
        });

    } catch (error) {
        console.error('Fix passwords error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error' 
        });
    } finally {
        await client.close();
    }
};