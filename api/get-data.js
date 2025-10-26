const { MongoClient } = require('mongodb');

const uri = process.env.MongoDB;
const client = new MongoClient(uri);

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        await client.connect();
        const db = client.db('bidaya');
        const collection = db.collection('data');

        // Get current data
        let data = await collection.findOne({ _id: 'main' });
        
        if (!data) {
            // If no data exists, load from the local data.json as fallback
            const fs = require('fs');
            const path = require('path');
            const localDataPath = path.join(process.cwd(), 'public', 'data.json');
            
            try {
                const localData = JSON.parse(fs.readFileSync(localDataPath, 'utf8'));
                
                // Initialize MongoDB with local data
                data = {
                    ...localData,
                    lastUpdated: new Date().toISOString()
                };
                
                await collection.updateOne(
                    { _id: 'main' },
                    { $set: data },
                    { upsert: true }
                );
            } catch (fileError) {
                return res.status(500).json({ 
                    error: 'No data found in database and unable to load fallback data' 
                });
            }
        }

        // Remove sensitive password information before sending
        const safeData = { ...data };
        if (safeData.users) {
            for (const username in safeData.users) {
                delete safeData.users[username].password;
            }
        }

        // Ensure both teamMembers (for admin panel) and team (for public pages) exist
        if (safeData.team && !safeData.teamMembers) {
            safeData.teamMembers = safeData.team;
        }
        if (safeData.teamMembers && !safeData.team) {
            safeData.team = safeData.teamMembers;
        }

        res.status(200).json(safeData);

    } catch (error) {
        console.error('Get data error:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    } finally {
        await client.close();
    }
};
