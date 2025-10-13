const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://muhammadhuzaifakhalidaziz:1Huzaifa3@discordbot.db3dr2k.mongodb.net/?retryWrites=true&w=majority';
const DB_NAME = 'bidaya_website';

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

module.exports = async (req, res) => {
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
    const { db } = await connectToDatabase();
    
    // Update the main data document
    const collection = db.collection('website_data');
    
    const updateData = {
      ...req.body,
      lastUpdated: new Date().toISOString()
    };
    
    // Upsert the main data document
    await collection.replaceOne(
      { _id: 'main_data' },
      { _id: 'main_data', ...updateData },
      { upsert: true }
    );
    
    res.status(200).json({ 
      message: 'Data saved successfully', 
      data: updateData 
    });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Failed to save data' });
  }
};