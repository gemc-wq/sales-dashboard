import express from 'express';
import { Firestore } from '@google-cloud/firestore';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Initialize Firestore with explicit project ID
const firestore = new Firestore({
    projectId: 'royalty-converter'
});

// Serve static files from the React build
app.use(express.static(path.join(__dirname, 'dist')));

// API endpoint for main dashboard data
app.get('/api/dashboard-data', async (req, res) => {
    try {
        const doc = await firestore.collection('dashboards').doc('main').get();
        if (doc.exists) {
            res.json(doc.data());
        } else {
            res.status(404).json({ error: 'Data not found' });
        }
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// API endpoint for phone case dashboard data
app.get('/api/phone-case-data', async (req, res) => {
    try {
        const doc = await firestore.collection('dashboards').doc('phone-cases').get();
        if (doc.exists) {
            res.json(doc.data());
        } else {
            res.status(404).json({ error: 'Data not found' });
        }
    } catch (error) {
        console.error('Error fetching phone case data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Catch-all handler: serve React app for any other routes
app.get('/{*path}', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
