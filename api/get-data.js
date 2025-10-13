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
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();
    
    // Get main data from MongoDB
    const mainCollection = db.collection('website_data');
    let data = await mainCollection.findOne({ _id: 'main_data' });
    
    // If no data exists, return default structure
    if (!data) {
      data = {
        studentCount: 250,
        teamMembers: [],
        contactSubmissions: [],
        users: {
          "Founder": {
            "username": "Founder",
            "password": "bidaya2025",
            "role": "founder"
          }
        }
      };
    }
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).json({ error: 'Failed to retrieve data' });
  }
};