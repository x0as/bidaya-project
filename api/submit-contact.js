const { MongoClient } = require('mongodb');

const uri = process.env.MongoDB;
const client = new MongoClient(uri);

module.exports = async (req, res) => {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, email, interest, message } = req.body;

        // Basic validation
        if (!name || !email) {
            return res.status(400).json({ 
                success: false, 
                error: 'Name and email are required' 
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid email format' 
            });
        }

        // Connect to MongoDB and save contact submission
        await client.connect();
        const db = client.db('bidaya');
        const collection = db.collection('data');

        // Create contact submission object
        const contactSubmission = {
            name,
            email,
            interest: interest || '',
            message: message || '',
            timestamp: new Date().toISOString(),
            id: Date.now()
        };

        // Use $push to add contact submission without affecting other data
        await collection.updateOne(
            { _id: 'main' },
            { 
                $push: { contactSubmissions: contactSubmission },
                $setOnInsert: {
                    _id: 'main',
                    users: {},
                    teamMembers: [],
                    statistics: { studentCount: 2000, countryCount: 50, eventCount: 100 }
                }
            },
            { upsert: true }
        );

        console.log('Contact form submission saved to MongoDB:', contactSubmission);

        res.status(200).json({
            success: true,
            message: 'Thank you for your message! We will get back to you soon.'
        });

    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to submit contact form'
        });
    } finally {
        await client.close();
    }
};
