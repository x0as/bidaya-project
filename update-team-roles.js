const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://huz:bidaya2025@cluster0.egjavao.mongodb.net/';
const client = new MongoClient(uri);

async function updateTeamData() {
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

        // Revert descriptions for Sameer and Atharv to shorter versions
        const originalDescriptions = {
            'Sameer': 'Passionate about building innovative solutions and fostering collaboration.',
            'Atharv': 'Coding enthusiast and hackathon organizer with a passion for cutting-edge technology.'
        };

        // Update team members
        data.teamMembers.forEach(member => {
            // Revert descriptions
            if (originalDescriptions[member.name]) {
                console.log(`Reverting description for ${member.name}`);
                member.description = originalDescriptions[member.name];
            }

            // Add roleClass for leadership roles to make them highlighted
            if (member.name === 'Huzaifa') {
                member.role = 'Founder & CEO';
                member.roleClass = 'founder-role';
            } else if (member.name === 'Sameer') {
                member.role = 'Co-Founder';
                member.roleClass = 'cofounder-role';
            } else if (member.name === 'Atharv') {
                member.role = 'Co-Founder';
                member.roleClass = 'cofounder-role';
            } else if (member.name === 'Mansoor') {
                member.role = 'Bidaya Ambassador';
                member.roleClass = 'ambassador-role';
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

        console.log('✅ Updated team data successfully!');

        // Show updated data
        console.log('\n=== UPDATED TEAM MEMBERS ===');
        data.teamMembers.forEach(member => {
            console.log(`${member.name} - ${member.role} (${member.roleClass})`);
            console.log(`Description: "${member.description}"`);
            console.log('---');
        });

    } catch (error) {
        console.error('Error updating team data:', error);
    } finally {
        await client.close();
        console.log('Database connection closed');
    }
}

updateTeamData();