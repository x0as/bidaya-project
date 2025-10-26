const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

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

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
    }

    try {
        console.log('Login attempt for username:', username);
        
        if (!uri) {
            throw new Error('MongoDB URI not configured');
        }

        await client.connect();
        console.log('Connected to MongoDB for login');
        const db = client.db('bidaya');
        const collection = db.collection('data');

        // Get current data
        let data = await collection.findOne({ _id: 'main' });
        console.log('Login - Found data:', !!data);
        console.log('Login - Has users:', !!(data && data.users));
        console.log('Login - Available usernames:', data?.users ? Object.keys(data.users) : 'none');
        
        if (!data || !data.users) {
            return res.status(500).json({ 
                success: false, 
                error: 'Database not initialized. Please run migration first.' 
            });
        }

        // Check if user exists
        const user = data.users[username];
        console.log('User found:', !!user);
        console.log('User has password:', !!(user && user.password));
        console.log('Password length:', user?.password?.length || 0);
        console.log('Password starts with $2:', user?.password?.startsWith('$2') || false);
        
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                error: 'Invalid username or password' 
            });
        }

        // Check password - only use bcrypt (no more plain text fallback)
        let passwordValid = false;
        
        try {
            console.log('Attempting bcrypt comparison...');
            passwordValid = await bcrypt.compare(password, user.password);
            console.log('Password valid:', passwordValid);
        } catch (error) {
            console.error('Password comparison error:', error);
            return res.status(401).json({ 
                success: false, 
                error: 'Invalid username or password' 
            });
        }

        if (!passwordValid) {
            return res.status(401).json({ 
                success: false, 
                error: 'Invalid username or password' 
            });
        }

        // Successful login
        const { password: _, ...userInfo } = user; // Remove password from response
        
        res.status(200).json({
            success: true,
            user: userInfo,
            message: 'Login successful'
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error' 
        });
    } finally {
        await client.close();
    }
};
