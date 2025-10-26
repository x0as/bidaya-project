const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://huz:bidaya2025@cluster0.egjavao.mongodb.net/';
const client = new MongoClient(uri);

async function checkTeamData() {
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

        console.log('=== CURRENT TEAM DATA ===');
        data.teamMembers.forEach(member => {
            console.log(`${member.name}:`);
            console.log(`  Role: ${member.role}`);
            console.log(`  RoleClass: ${member.roleClass}`);
            console.log(`  Description: ${member.description.substring(0, 50)}...`);
            console.log('---');
        });

    } catch (error) {
        console.error('Error checking team data:', error);
    } finally {
        await client.close();
        console.log('Database connection closed');
    }
}

checkTeamData();