const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://huz:bidaya2025@cluster0.egjavao.mongodb.net/';
const client = new MongoClient(uri);

async function fixTeamRoleClasses() {
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

        // Fix roleClass for leadership members while keeping specific role styling
        data.teamMembers.forEach(member => {
            if (member.name === 'Huzaifa') {
                member.roleClass = 'leadership-card';
                member.roleStyle = 'founder-role'; // Keep styling info separate
            } else if (member.name === 'Sameer' || member.name === 'Atharv') {
                member.roleClass = 'leadership-card';
                member.roleStyle = 'cofounder-role';
            } else if (member.name === 'Mansoor') {
                member.roleClass = 'leadership-card';
                member.roleStyle = 'ambassador-role';
            }
            // Department heads keep their existing roleClass: 'department-card'
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

        console.log('✅ Fixed roleClass values for leadership members!');

        // Show updated structure
        console.log('\n=== FIXED TEAM STRUCTURE ===');
        const leadership = data.teamMembers.filter(member => member.roleClass === 'leadership-card');
        const departments = data.teamMembers.filter(member => member.roleClass === 'department-card');
        
        console.log(`Leadership members (${leadership.length}):`);
        leadership.forEach(member => {
            console.log(`  ${member.name} - ${member.role} (roleClass: ${member.roleClass}, roleStyle: ${member.roleStyle})`);
        });
        
        console.log(`\nDepartment heads (${departments.length}):`);
        departments.forEach(member => {
            console.log(`  ${member.name} - ${member.role} (roleClass: ${member.roleClass})`);
        });

    } catch (error) {
        console.error('Error fixing roleClass values:', error);
    } finally {
        await client.close();
        console.log('Database connection closed');
    }
}

fixTeamRoleClasses();