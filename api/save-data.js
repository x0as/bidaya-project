const { MongoClient } = require('mongodb');

const uri = process.env.MongoDB;
const client = new MongoClient(uri);

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { data: newData } = req.body;

        if (!newData) {
            return res.status(400).json({ error: 'No data provided' });
        }

        console.log('Attempting to connect to MongoDB...');
        await client.connect();
        console.log('Connected to MongoDB successfully');
        const db = client.db('bidaya');
        const collection = db.collection('data');

        // Sync admin panel data to public-facing data
        const syncedData = {
            ...newData,
            lastUpdated: new Date().toISOString()
        };

        // If admin panel sends teamMembers, sync it to team for public pages
        if (syncedData.teamMembers && Array.isArray(syncedData.teamMembers)) {
            syncedData.team = syncedData.teamMembers.map(member => ({
                ...member,
                // Ensure proper roleClass for filtering
                roleClass: member.category === 'leadership' ? 'leadership-card' : 'department-card'
            }));
        }

        // Save to MongoDB - only update public-facing fields to avoid overwriting sensitive data (like users)
        const publicFieldsToSet = {};
        if (syncedData.stats) publicFieldsToSet.stats = syncedData.stats;
        if (syncedData.team) publicFieldsToSet.team = syncedData.team;
        if (syncedData.teamMembers) publicFieldsToSet.teamMembers = syncedData.teamMembers;
        if (syncedData.lastUpdated) publicFieldsToSet.lastUpdated = syncedData.lastUpdated;
        // If there are other explicitly public fields you want to allow, add them here

        // Perform a safe update that only modifies allowed public fields
        await collection.updateOne(
            { _id: 'main' },
            { $set: publicFieldsToSet },
            { upsert: true }
        );

        res.status(200).json({ 
            success: true, 
            message: 'Data saved successfully',
            lastUpdated: syncedData.lastUpdated
        });

    } catch (error) {
        console.error('Save data error:', error);
        console.error('Error details:', error.message);
        console.error('Request body:', req.body);
        res.status(500).json({ 
            success: false, 
            error: `Failed to save data: ${error.message}` 
        });
    } finally {
        await client.close();
    }
};
