const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const dataPath = path.join(process.cwd(), 'data.json');
    
    // Read existing data
    let currentData = {};
    if (fs.existsSync(dataPath)) {
      const fileContent = fs.readFileSync(dataPath, 'utf8');
      currentData = JSON.parse(fileContent);
    }

    // Initialize contactSubmissions if it doesn't exist
    if (!currentData.contactSubmissions) {
      currentData.contactSubmissions = [];
    }

    // Add new contact submission
    const contactData = {
      ...req.body,
      timestamp: new Date().toISOString(),
      id: Date.now()
    };
    
    currentData.contactSubmissions.push(contactData);
    currentData.lastUpdated = new Date().toISOString();
    
    // Write back to file
    fs.writeFileSync(dataPath, JSON.stringify(currentData, null, 2));
    
    res.status(200).json({ 
      message: 'Contact form submitted successfully', 
      data: contactData 
    });
  } catch (error) {
    console.error('Error saving contact form:', error);
    res.status(500).json({ error: 'Failed to save contact form' });
  }
}