// Run this in the console to check current MongoDB data
async function checkCurrentData() {
    try {
        const response = await fetch('/api/get-data');
        const data = await response.json();
        
        console.log('Current MongoDB Data:');
        console.log('====================');
        
        data.teamMembers.forEach(member => {
            console.log(`${member.name} (ID: ${member.id})`);
            console.log(`  Avatar: ${member.avatar}`);
            console.log(`  Role: ${member.role}`);
            console.log(`  Category: ${member.category}`);
            console.log('---');
        });
        
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Run the check
checkCurrentData();