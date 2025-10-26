const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://huz:bidaya2025@cluster0.egjavao.mongodb.net/';
const client = new MongoClient(uri);

async function updateDescriptionLengths() {
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

        // Update descriptions with proper length hierarchy
        data.teamMembers.forEach(member => {
            if (member.name === 'Huzaifa') {
                member.description = 'Building the future of student innovation worldwide.';
                console.log(`Made Huzaifa's description much shorter`);
            } else if (member.name === 'Sameer') {
                member.description = 'Passionate about building innovative solutions and fostering collaboration between students globally. Committed to creating meaningful opportunities that drive technological advancement and positive impact in communities worldwide.';
                console.log(`Made Sameer's description longer than Huzaifa's`);
            } else if (member.name === 'Atharv') {
                member.description = 'Coding enthusiast and hackathon organizer with a passion for cutting-edge technology. Dedicated to building innovative solutions and creating collaborative environments where creativity meets technical excellence to solve real-world challenges.';
                console.log(`Made Atharv's description longer than Huzaifa's`);
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

        console.log('✅ Updated description lengths successfully!');

        // Show the new descriptions
        console.log('\n=== NEW DESCRIPTION LENGTHS ===');
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

updateDescriptionLengths();