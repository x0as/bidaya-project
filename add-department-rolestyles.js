const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://huz:bidaya2025@cluster0.egjavao.mongodb.net/';
const client = new MongoClient(uri);

async function addDepartmentRoleStyles() {
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

        // Add roleStyle to department heads
        data.teamMembers.forEach(member => {
            if (member.roleClass === 'department-card' && !member.roleStyle) {
                member.roleStyle = 'department-role';
                console.log(`Added roleStyle to ${member.name}`);
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

        console.log('✅ Added roleStyle to all department heads!');

        // Verify all members now have roleStyle
        console.log('\n=== ALL ROLES NOW HIGHLIGHTED ===');
        data.teamMembers.forEach(member => {
            console.log(`${member.name}: ${member.roleStyle}`);
        });

    } catch (error) {
        console.error('Error updating roleStyles:', error);
    } finally {
        await client.close();
        console.log('Database connection closed');
    }
}

addDepartmentRoleStyles();