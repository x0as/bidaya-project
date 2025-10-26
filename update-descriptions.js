const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://huz:bidaya2025@cluster0.egjavao.mongodb.net/';
const client = new MongoClient(uri);

const updatedDescriptions = {
    'Mansoor': 'The role of ambassador is a very huge opportunity for myself. My role will help it stay afloat and help as many students that it can reach.',
    'Huzaifa': 'Visionary leader building the future of student innovation and collaboration worldwide. Passionate about creating meaningful connections and empowering the next generation of tech leaders.',
    'Atharv': 'Coding enthusiast and hackathon organizer with a passion for cutting-edge technology. Dedicated to building innovative solutions and fostering a collaborative environment where creativity meets technical excellence. Leading the charge in making Bidaya a hub for technological advancement.',
    'Sameer': 'Visionary student leader passionate about empowering youth through technology and collaboration. Committed to building bridges between students globally and creating opportunities for meaningful impact. Driving initiatives that transform ideas into reality.'
};

async function updateDescriptions() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        
        const db = client.db('bidaya');
        const collection = db.collection('data');

        const data = await collection.findOne({ _id: 'main' });
        
        if (!data || !data.teamMembers) {
            console.log('No teamMembers found in database');
            return;
        }

        let updatedCount = 0;

        // Update descriptions for specific members
        data.teamMembers.forEach(member => {
            if (updatedDescriptions[member.name]) {
                console.log(`Updating description for ${member.name}`);
                member.description = updatedDescriptions[member.name];
                updatedCount++;
            }
        });

        // Also sync to team array
        data.team = data.teamMembers.map(member => ({ ...member }));
        data.lastUpdated = new Date().toISOString();

        // Update the database
        await collection.updateOne(
            { _id: 'main' },
            { 
                $set: { 
                    teamMembers: data.teamMembers,
                    team: data.team,
                    lastUpdated: data.lastUpdated
                }
            }
        );

        console.log(`✅ Updated descriptions for ${updatedCount} team members!`);

        // Verify the updates
        console.log('\n=== UPDATED DESCRIPTIONS ===');
        Object.keys(updatedDescriptions).forEach(name => {
            const member = data.teamMembers.find(m => m.name === name);
            if (member) {
                console.log(`${name}: "${member.description}"`);
            }
        });

    } catch (error) {
        console.error('Error updating descriptions:', error);
    } finally {
        await client.close();
        console.log('Database connection closed');
    }
}

updateDescriptions();