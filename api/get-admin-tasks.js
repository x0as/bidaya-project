const { MongoClient } = require('mongodb');

const uri = process.env.MongoDB;
const client = new MongoClient(uri);

function sortNewestFirst(a, b) {
    const aTime = new Date(a.completedAt || a.updatedAt || a.createdAt || 0).getTime();
    const bTime = new Date(b.completedAt || b.updatedAt || b.createdAt || 0).getTime();
    return bTime - aTime;
}

module.exports = async (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        if (!uri) {
            return res.status(500).json({ success: false, error: 'MongoDB URI not configured' });
        }

        await client.connect();
        const db = client.db('bidaya');
        const collection = db.collection('data');

        const data = await collection.findOne({ _id: 'main' });
        const tasks = Array.isArray(data?.tasks) ? data.tasks : [];

        const pendingApproval = tasks.filter(task => task.status === 'completed').sort(sortNewestFirst);
        const completedApproved = tasks.filter(task => task.status === 'approved').sort(sortNewestFirst);
        const takenTasks = tasks.filter(task => task.status === 'taken').sort(sortNewestFirst);

        return res.status(200).json({
            success: true,
            counts: {
                pendingApproval: pendingApproval.length,
                completedApproved: completedApproved.length,
                takenTasks: takenTasks.length,
                total: tasks.length
            },
            pendingApproval,
            completedApproved,
            takenTasks
        });
    } catch (error) {
        console.error('get-admin-tasks error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    } finally {
        await client.close();
    }
};
