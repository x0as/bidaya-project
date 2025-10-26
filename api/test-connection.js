const { MongoClient } = require('mongodb');

const uri = process.env.MongoDB;

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        console.log('Testing MongoDB connection...');
        console.log('URI exists:', !!uri);
        console.log('URI starts with mongodb:', uri?.startsWith('mongodb'));
        
        const client = new MongoClient(uri);
        await client.connect();
        
        const db = client.db('bidaya');
        const collection = db.collection('data');
        
        // Try to read data
        const data = await collection.findOne({ _id: 'main' });
        
        await client.close();
        
        res.status(200).json({ 
            success: true,
            message: 'MongoDB connection test successful',
            hasData: !!data,
            dataKeys: data ? Object.keys(data) : []
        });

    } catch (error) {
        console.error('Connection test error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message,
            stack: error.stack
        });
    }
};