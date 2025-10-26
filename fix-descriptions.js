const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://huz:bidaya2025@cluster0.egjavao.mongodb.net/';
const client = new MongoClient(uri);

async function fixDescriptions() {
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

        // Update descriptions with better balance
        data.teamMembers.forEach(member => {
            if (member.name === 'Huzaifa') {
                member.description = 'Visionary leader building the future of student innovation and collaboration worldwide.';
                console.log(`Increased Huzaifa's description slightly`);
            } else if (member.name === 'Sameer') {
                member.description = 'Passionate about building innovative solutions and fostering collaboration between students globally.';
                console.log(`Reduced Sameer's description`);
            } else if (member.name === 'Atharv') {
                member.description = 'Coding enthusiast and hackathon organizer dedicated to building innovative solutions and technical excellence.';
                console.log(`Reduced Atharv's description`);
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

        console.log('✅ Fixed description lengths!');

        // Show the new descriptions
        console.log('\n=== UPDATED DESCRIPTIONS ===');
        ['Huzaifa', 'Sameer', 'Atharv'].forEach(name => {
            const member = data.teamMembers.find(m => m.name === name);
            if (member) {
                console.log(`${name} (${member.description.length} chars): "${member.description}"`);
            }
        });

    } catch (error) {
        console.error('Error updating descriptions:', error);
    } finally {
        await client.close();
        console.log('Database connection closed');
    }
}

fixDescriptions();