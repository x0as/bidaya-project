const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const newUri = "mongodb+srv://huz:bidaya2025@cluster0.egjavao.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Use GET to initialize database' });
    }

    try {
        // Connect to new database
        const client = new MongoClient(newUri);
        await client.connect();
        const db = client.db('bidaya');
        const collection = db.collection('data');

        // Complete fresh data with proper passwords
        const freshData = {
            _id: 'main',
            stats: {
                studentCount: 2000,
                countryCount: 50,
                eventCount: 100
            },
            team: [
                {
                    name: "Huzaifa",
                    role: "Founder & CEO",
                    description: "Visionary leader building the future of student innovation and collaboration worldwide.",
                    avatar: "H",
                    roleClass: "leadership-card"
                },
                {
                    name: "Atharv",
                    role: "Co-Founder & CTO",
                    description: "Coding enthusiast and hackathon organizer, making sure Bidaya stays at the cutting edge.",
                    avatar: "B",
                    roleClass: "leadership-card"
                },
                {
                    name: "Hamza",
                    role: "Head of Finance",
                    description: "Managing financial operations and budget planning for sustainable growth.",
                    avatar: "H",
                    roleClass: "department-card",
                    teamMembers: []
                },
                {
                    name: "Rama",
                    role: "Head of Operations",
                    description: "Ensuring smooth operations and efficient project management across all departments.",
                    avatar: "R",
                    roleClass: "department-card",
                    teamMembers: []
                },
                {
                    name: "Yusuf",
                    role: "Head of Marketing",
                    description: "Building brand awareness and managing outreach campaigns to connect with students globally.",
                    avatar: "Y",
                    roleClass: "department-card",
                    teamMembers: []
                },
                {
                    name: "Sim",
                    role: "Head of Technology",
                    description: "Leading technical development and ensuring robust infrastructure for all Bidaya platforms.",
                    avatar: "S",
                    roleClass: "department-card",
                    teamMembers: []
                },
                {
                    name: "Ibrahim",
                    role: "Head of Human Resources",
                    description: "Managing talent acquisition and fostering a positive culture within the Bidaya community.",
                    avatar: "I",
                    roleClass: "department-card",
                    teamMembers: []
                }
            ],
            users: {
                "Founder": {
                    "password": await bcrypt.hash("bidaya2025", 12),
                    "role": "Founder",
                    "name": "Main Administrator",
                    "permissions": ["edit_stats", "view_contacts", "delete_members", "manage_all"]
                },
                "Hamza": {
                    "password": await bcrypt.hash("@4729", 12),
                    "role": "HOD",
                    "name": "Hamza",
                    "department": "Finance",
                    "permissions": ["manage_own_team", "view_contacts", "edit_profile"]
                },
                "Rama": {
                    "password": await bcrypt.hash("@8351", 12),
                    "role": "HOD",
                    "name": "Rama",
                    "department": "Operations",
                    "permissions": ["manage_own_team", "view_contacts", "edit_profile"]
                },
                "Yusuf": {
                    "password": await bcrypt.hash("@6194", 12),
                    "role": "HOD",
                    "name": "Yusuf",
                    "department": "Marketing",
                    "permissions": ["manage_own_team", "view_contacts", "edit_profile"]
                },
                "Sim": {
                    "password": await bcrypt.hash("@2847", 12),
                    "role": "HOD",
                    "name": "Sim",
                    "department": "Technology",
                    "permissions": ["manage_own_team", "view_contacts", "edit_profile"]
                },
                "Ibrahim": {
                    "password": await bcrypt.hash("@9563", 12),
                    "role": "HOD",
                    "name": "Ibrahim",
                    "department": "Human Resources",
                    "permissions": ["manage_own_team", "view_contacts", "edit_profile"]
                }
            },
            contactSubmissions: [],
            lastUpdated: new Date().toISOString()
        };

        // Save to new database
        await collection.updateOne(
            { _id: 'main' },
            { $set: freshData },
            { upsert: true }
        );

        await client.close();

        res.status(200).json({ 
            success: true, 
            message: 'New database initialized successfully!',
            users: Object.keys(freshData.users),
            teamMembers: freshData.team.length,
            stats: freshData.stats
        });

    } catch (error) {
        console.error('Initialize error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
};