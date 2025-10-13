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

    // Update with new data
    const newData = { ...currentData, ...req.body, lastUpdated: new Date().toISOString() };
    
    // Write back to file
    fs.writeFileSync(dataPath, JSON.stringify(newData, null, 2));
    
    res.status(200).json({ message: 'Data saved successfully', data: newData });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Failed to save data' });
  }
}