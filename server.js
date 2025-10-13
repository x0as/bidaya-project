const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Save data endpoint
app.post('/save-data', async (req, res) => {
    try {
        const data = req.body;
        
        // Validate required structure
        if (!data.stats || !data.teamMembers) {
            return res.status(400).json({ error: 'Missing required data structure' });
        }
        
        // Save to data.json
        const jsonString = JSON.stringify(data, null, 2);
        await fs.writeFile('data.json', jsonString, 'utf8');
        
        res.json({ success: true, message: 'Data saved successfully' });
        console.log('✅ Data saved to data.json at', new Date().toISOString());
        
    } catch (error) {
        console.error('❌ Error saving data:', error);
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// Contact form submission endpoint
app.post('/submit-contact', async (req, res) => {
    try {
        const contactData = req.body;
        
        // Validate required fields
        if (!contactData.name || !contactData.email) {
            return res.status(400).json({ error: 'Name and email are required' });
        }
        
        // Read current data
        let data;
        try {
            const dataStr = await fs.readFile('data.json', 'utf8');
            data = JSON.parse(dataStr);
        } catch (error) {
            return res.status(500).json({ error: 'Failed to read data file' });
        }
        
        // Initialize contactSubmissions if it doesn't exist
        if (!data.contactSubmissions) {
            data.contactSubmissions = [];
        }
        
        // Add new submission
        data.contactSubmissions.unshift(contactData); // Add to beginning
        
        // Keep only last 100 submissions
        data.contactSubmissions = data.contactSubmissions.slice(0, 100);
        
        // Save updated data
        const jsonString = JSON.stringify(data, null, 2);
        await fs.writeFile('data.json', jsonString, 'utf8');
        
        res.json({ success: true, message: 'Contact form submitted successfully' });
        console.log('📧 New contact submission from:', contactData.name, contactData.email);
        
    } catch (error) {
        console.error('❌ Error saving contact submission:', error);
        res.status(500).json({ error: 'Failed to save contact submission' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Bidaya Admin Server running on http://localhost:${PORT}`);
    console.log(`📝 Admin panel: http://localhost:${PORT}/admin.html`);
    console.log(`🏠 Website: http://localhost:${PORT}/index.html`);
});