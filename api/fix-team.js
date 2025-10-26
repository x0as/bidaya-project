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

        // Updated team with Sameer and team members for HODs
        const updatedTeam = [
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
                name: "Sameer",
                role: "Co-Founder & COO",
                description: "Strategic operations leader ensuring seamless execution of Bidaya's vision and growth initiatives.",
                avatar: "S",
                roleClass: "leadership-card"
            },
            {
                name: "Hamza",
                role: "Head of Finance",
                description: "Managing financial operations and budget planning for sustainable growth.",
                avatar: "H",
                roleClass: "department-card",
                teamMembers: ["Sarah Ahmed", "Michael Chen", "Fatima Al-Zahra"]
            },
            {
                name: "Rama",
                role: "Head of Operations",
                description: "Ensuring smooth operations and efficient project management across all departments.",
                avatar: "R",
                roleClass: "department-card",
                teamMembers: ["Alex Rodriguez", "Priya Sharma", "Omar Hassan"]
            },
            {
                name: "Yusuf",
                role: "Head of Marketing",
                description: "Building brand awareness and managing outreach campaigns to connect with students globally.",
                avatar: "Y",
                roleClass: "department-card",
                teamMembers: ["Emma Johnson", "Zain Malik", "Lina Okonkwo"]
            },
            {
                name: "Sim",
                role: "Head of Technology",
                description: "Leading technical development and ensuring robust infrastructure for all Bidaya platforms.",
                avatar: "S",
                roleClass: "department-card",
                teamMembers: ["David Kim", "Aisha Patel", "Carlos Silva"]
            },
            {
                name: "Ibrahim",
                role: "Head of Human Resources",
                description: "Managing talent acquisition and fostering a positive culture within the Bidaya community.",
                avatar: "I",
                roleClass: "department-card",
                teamMembers: ["Maya Singh", "Ahmed Nasser", "Sophie Taylor"]
            }
        ];

        // Update the data
        currentData.team = updatedTeam;
        currentData.lastUpdated = new Date().toISOString();

        // Save back to database
        await collection.updateOne(
            { _id: 'main' },
            { $set: currentData },
            { upsert: true }
        );

        await client.close();

        res.status(200).json({ 
            success: true,
            message: 'Team updated successfully!',
            leadership: updatedTeam.filter(m => m.roleClass === 'leadership-card').length,
            departments: updatedTeam.filter(m => m.roleClass === 'department-card').length,
            totalTeamMembers: updatedTeam.reduce((sum, m) => sum + (m.teamMembers?.length || 0), 0),
            team: updatedTeam
        });

    } catch (error) {
        console.error('Update team error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
};