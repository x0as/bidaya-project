const { MongoClient } = require('mongodb');

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
        const currentData = await collection.findOne({ _id: 'main' });
        
        if (!currentData) {
            throw new Error('No data found');
        }

        // Add Sameer to the team array
        const sameerData = {
            name: "Sameer",
            role: "Co-Founder",
            description: "Visionary student leader passionate about empowering youth through technology and collaboration.",
            avatar: "S",
            roleClass: "leadership-card"
        };

        // Check if Sameer already exists in team array
        const sameerExists = currentData.team.some(member => member.name === "Sameer");
        
        if (!sameerExists) {
            // Add Sameer to the team array (insert after Atharv, before department heads)
            currentData.team.splice(2, 0, sameerData);
        }

        // Update the database
        await collection.updateOne(
            { _id: 'main' },
            { $set: currentData },
            { upsert: true }
        );

        await client.close();

        res.status(200).json({ 
            success: true,
            message: 'Sameer added to team successfully!',
            team: currentData.team,
            teamCount: currentData.team.length
        });

    } catch (error) {
        console.error('Fix team error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
};