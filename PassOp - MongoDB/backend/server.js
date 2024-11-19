const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Configuration
const url = 'mongodb://localhost:27017'; // Replace with your MongoDB connection string if using a hosted database
const dbName = 'passwordManager';
let db;

// Connect to MongoDB
MongoClient.connect(url, { useUnifiedTopology: true })
    .then((client) => {
        console.log('Connected to MongoDB');
        db = client.db(dbName);
    })
    .catch((error) => console.error(error));

// Routes
// Get all passwords
app.get('/', async (req, res) => {
    try {
        const passwords = await db.collection('passwords').find().toArray();
        res.status(200).json(passwords);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch passwords' });
    }
});

// Add a new password
app.post('/', async (req, res) => {
    const { site, username, password } = req.body;
    if (!site || !username || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        const result = await db.collection('passwords').insertOne({ site, username, password });
        res.status(201).json({ message: 'Password saved', result });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save password' });
    }
});

// Update a password
app.put('/', async (req, res) => {
    const { _id, site, username, password } = req.body;
    if (!_id || !site || !username || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        const result = await db.collection('passwords').updateOne(
            { _id: new ObjectId(_id) },
            { $set: { site, username, password } }
        );
        res.status(200).json({ message: 'Password updated', result });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update password' });
    }
});

// Delete a password
app.delete('/', async (req, res) => {
    const { _id } = req.body;
    if (!_id) {
        return res.status(400).json({ error: 'ID is required' });
    }
    try {
        const result = await db.collection('passwords').deleteOne({ _id: new ObjectId(_id) });
        res.status(200).json({ message: 'Password deleted', result });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete password' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
