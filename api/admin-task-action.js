const { MongoClient } = require('mongodb');

const uri = process.env.MongoDB;
const client = new MongoClient(uri);

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        if (!uri) {
            return res.status(500).json({ success: false, error: 'MongoDB URI not configured' });
        }

        const { taskId, action, adminUser } = req.body || {};

        if (!taskId || !action) {
            return res.status(400).json({ success: false, error: 'taskId and action are required' });
        }

        const allowedActions = ['approve', 'delete_completed', 'release_taken', 'release_all_taken'];
        if (!allowedActions.includes(action)) {
            return res.status(400).json({ success: false, error: 'Invalid action' });
        }

        await client.connect();
        const db = client.db('bidaya');
        const collection = db.collection('data');

        const data = await collection.findOne({ _id: 'main' });
        const tasks = Array.isArray(data?.tasks) ? data.tasks : [];
        const now = new Date().toISOString();

        if (action === 'release_all_taken') {
            let releaseCount = 0;
            const updatedTasks = tasks.map((task) => {
                if (task.status !== 'taken') {
                    return task;
                }

                releaseCount += 1;
                return {
                    ...task,
                    status: 'open',
                    takenBy: null,
                    takenAt: null,
                    releasedBy: adminUser || 'Admin',
                    releasedAt: now,
                    updatedAt: now
                };
            });

            await collection.updateOne(
                { _id: 'main' },
                {
                    $set: {
                        tasks: updatedTasks,
                        lastUpdated: now
                    }
                },
                { upsert: true }
            );

            return res.status(200).json({ success: true, message: `Released ${releaseCount} taken task(s)` });
        }

        const taskIndex = tasks.findIndex(task => String(task.id) === String(taskId));
        if (taskIndex === -1) {
            return res.status(404).json({ success: false, error: 'Task not found' });
        }

        const task = tasks[taskIndex];

        if (action === 'approve') {
            if (task.status !== 'completed') {
                return res.status(400).json({ success: false, error: 'Only completed tasks can be approved' });
            }

            tasks[taskIndex] = {
                ...task,
                status: 'approved',
                approvedBy: adminUser || 'Admin',
                approvedAt: now,
                updatedAt: now
            };
        }

        if (action === 'delete_completed') {
            if (task.status !== 'completed' && task.status !== 'approved') {
                return res.status(400).json({ success: false, error: 'Only completed or approved tasks can be deleted' });
            }

            tasks.splice(taskIndex, 1);
        }

        if (action === 'release_taken') {
            if (task.status !== 'taken') {
                return res.status(400).json({ success: false, error: 'Only taken tasks can be released' });
            }

            tasks[taskIndex] = {
                ...task,
                status: 'open',
                takenBy: null,
                takenAt: null,
                releasedBy: adminUser || 'Admin',
                releasedAt: now,
                updatedAt: now
            };
        }

        await collection.updateOne(
            { _id: 'main' },
            {
                $set: {
                    tasks,
                    lastUpdated: now
                }
            },
            { upsert: true }
        );

        return res.status(200).json({ success: true, message: 'Task updated successfully' });
    } catch (error) {
        console.error('admin-task-action error:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    } finally {
        await client.close();
    }
};
