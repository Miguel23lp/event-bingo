import express from 'express';
import cors from 'cors';
import { JSONFilePreset } from 'lowdb/node';

const app = express();
const defaultData = { events: [] }
const port = 3000;

// Set up lowdb with a JSON file adapter
const db = await JSONFilePreset('db.json', defaultData);

// Enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// GET endpoint to retrieve all pets
app.get('/events', (req, res) => {
    res.json(db.data.events);
});

// POST endpoint to add a new pet
app.post('/events', async (req, res) => {
    const event = req.body;
    db.data.events.push(event);
    await db.write();
    res.status(201).json(event);
});

app.get('/cards', (req, res) => {
    res.json(db.data.cards);
});

app.post('/cards', async (req, res) => {
    const card = req.body;
    db.data.cards.push(card);
    await db.write();
    res.status(201).json(card);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

