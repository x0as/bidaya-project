// Copy and paste this entire script into your browser console when on the admin panel
// This will migrate the team data directly

async function migrateTeamData() {
    console.log('🚀 Starting team data migration...');
    
    // The actual team data from data.json
    const teamData = {
        "stats": {
            "studentCount": 2000,
            "countryCount": 50,
            "eventCount": 100
        },
        "contactSubmissions": [
            {
                "name": "Lenore Hintz",
                "email": "asasa@gmail.com",
                "interest": "workshops",
                "message": "HHHH",
                "timestamp": "2025-10-13T08:44:35.016Z",
                "id": 1760345075016
            }
        ],
        "teamMembers": [
            {
                "id": 1,
                "name": "Atharv",
                "role": "Co-Founder",
                "description": "Coding enthusiast and hackathon organizer, making sure Bidaya stays at the cutting edge.",
                "avatar": "A",
                "category": "leadership",
                "roleClass": "cofounder-role"
            },
            {
                "id": 2,
                "name": "Huzaifa",
                "role": "Founder & CEO",
                "description": "Visionary leader building the future of student innovation and collaboration worldwide.",
                "avatar": "H",
                "category": "leadership",
                "roleClass": "founder-role"
            },
            {
                "id": 3,
                "name": "Sameer",
                "role": "Co-Founder",
                "description": "Visionary student leader passionate about empowering youth through technology and collaboration.",
                "avatar": "S",
                "category": "leadership",
                "roleClass": "cofounder-role"
            },
            {
                "id": 9,
                "name": "Rama",
                "role": "Head of Operations",
                "description": "Bringing creative workshops and global events to life with exceptional organizational skills.",
                "avatar": "R",
                "category": "hod",
                "roleClass": "department-role",
                "teamMembers": ["Mansour", "Arnav"]
            },
            {
                "id": 10,
                "name": "Yusuf",
                "role": "Head of Marketing",
                "description": "Spreading the word and growing the Bidaya movement through strategic marketing initiatives.",
                "avatar": "Y",
                "category": "hod",
                "roleClass": "department-role",
                "teamMembers": ["Misagh"]
            },
            {
                "id": 11,
                "name": "Sim",
                "role": "Head of Tech",
                "description": "Leading the team with organization and vision, ensuring technical excellence in all projects.",
                "avatar": "S",
                "category": "hod",
                "roleClass": "department-role",
                "teamMembers": ["Omer", "Jitin", "Rigo"]
            },
            {
                "id": 12,
                "name": "Hamza",
                "role": "Head of Finance",
                "description": "Building partnerships and connecting Bidaya with schools and organizations worldwide.",
                "avatar": "H",
                "category": "hod",
                "roleClass": "department-role",
                "teamMembers": ["Daniel"]
            },
            {
                "id": 13,
                "name": "Ibrahim",
                "role": "Head of HR",
                "description": "Managing human resources and building strong team relationships to foster collaboration.",
                "avatar": "I",
                "category": "hod",
                "roleClass": "department-role",
                "teamMembers": ["Mukundh"]
            }
        ]
    };

    try {
        // Use the save-data API to update the database
        const response = await fetch('/api/save-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: teamData })
        });

        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Migration successful!');
            console.log(`📊 Team members: ${teamData.teamMembers.length}`);
            console.log(`📧 Contact submissions: ${teamData.contactSubmissions.length}`);
            console.log('🔄 Reloading page to show new data...');
            
            // Reload the page to show the new data
            window.location.reload();
        } else {
            console.error('❌ Migration failed:', result.error);
        }
    } catch (error) {
        console.error('❌ Migration error:', error);
    }
}

// Run the migration
migrateTeamData();