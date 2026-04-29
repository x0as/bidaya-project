const { MongoClient } = require('mongodb');
const nodemailer = require('nodemailer');

function createMongoClient() {
    const uri = process.env.MongoDB;
    if (!uri) {
        throw new Error('MongoDB environment variable is missing');
    }
    return new MongoClient(uri);
}

function parseRecipients(value) {
    if (!value) return [];
    return value
        .split(',')
        .map((email) => email.trim())
        .filter(Boolean);
}

function resolveForwardRecipients(interest) {
    const recipients = new Set(parseRecipients(process.env.CONTACT_FORWARD_TO));
    const mapRaw = process.env.CONTACT_FORWARD_MAP;

    if (!mapRaw || !interest) {
        return [...recipients];
    }

    try {
        const map = JSON.parse(mapRaw);
        const directMatch = map[interest] || map[String(interest).toLowerCase()];
        if (Array.isArray(directMatch)) {
            directMatch.forEach((email) => recipients.add(String(email).trim()));
        } else if (typeof directMatch === 'string') {
            parseRecipients(directMatch).forEach((email) => recipients.add(email));
        }
    } catch (error) {
        console.warn('CONTACT_FORWARD_MAP is not valid JSON. Skipping interest routing.');
    }

    return [...recipients].filter(Boolean);
}

async function forwardSubmissionByEmail(submission) {
    const recipients = resolveForwardRecipients(submission.interest);
    if (!recipients.length) {
        return { forwarded: false, reason: 'No recipients configured' };
    }

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.SMTP_FROM || user;
    const secure = String(process.env.SMTP_SECURE || 'false').toLowerCase() === 'true';

    if (!host || !user || !pass || !from) {
        return { forwarded: false, reason: 'SMTP env vars are incomplete' };
    }

    const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass }
    });

    const subject = `[Bidaya Contact] ${submission.name} (${submission.interest || 'General'})`;
    const text = [
        `Name: ${submission.name}`,
        `Email: ${submission.email}`,
        `Interest: ${submission.interest || 'Not provided'}`,
        '',
        'Message:',
        submission.message || '(No message)',
        '',
        `Submitted At: ${submission.timestamp}`,
        `Submission ID: ${submission.id}`
    ].join('\n');

    await transporter.sendMail({
        from,
        to: recipients,
        replyTo: submission.email,
        subject,
        text
    });

    return { forwarded: true, recipients };
}

module.exports = async (req, res) => {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    let client;
    try {
        const { name, email, interest, message } = req.body;

        // Basic validation
        if (!name || !email) {
            return res.status(400).json({ 
                success: false, 
                error: 'Name and email are required' 
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid email format' 
            });
        }

        // Connect to MongoDB and save contact submission
        client = createMongoClient();
        await client.connect();
        const db = client.db('bidaya');
        const collection = db.collection('data');

        // Create contact submission object
        const contactSubmission = {
            name,
            email,
            interest: interest || '',
            message: message || '',
            timestamp: new Date().toISOString(),
            id: Date.now()
        };

        // Use $push to add contact submission without affecting other data
        await collection.updateOne(
            { _id: 'main' },
            { 
                $push: { contactSubmissions: contactSubmission },
                $setOnInsert: {
                    _id: 'main',
                    users: {},
                    teamMembers: [],
                    statistics: { studentCount: 2000, countryCount: 50, eventCount: 100 }
                }
            },
            { upsert: true }
        );

        console.log('Contact form submission saved to MongoDB:', contactSubmission);

        try {
            const forwardResult = await forwardSubmissionByEmail(contactSubmission);
            if (forwardResult.forwarded) {
                console.log('Contact submission forwarded to:', forwardResult.recipients.join(', '));
            } else {
                console.log('Contact submission not forwarded:', forwardResult.reason);
            }
        } catch (mailError) {
            // Keep the submission successful even if forwarding fails.
            console.error('Contact submission saved, but forwarding failed:', mailError.message);
        }

        res.status(200).json({
            success: true,
            message: 'Thank you for your message! We will get back to you soon.'
        });

    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to submit contact form'
        });
    } finally {
        if (client) {
            await client.close();
        }
    }
};
