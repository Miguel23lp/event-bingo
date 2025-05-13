import express from 'express';
import cors from 'cors';
import { JSONFilePreset } from 'lowdb/node';
import { WebSocketServer } from 'ws';
import http, { STATUS_CODES } from 'http';
import { exitCode } from 'process';

const app = express();
const defaultData = { events: [] }
const port = 3000;

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const clients = new Map();

wss.on('connection', (ws, req) => {
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            
            console.log('Received data:', data);
            if (data.type === 'register' && data.userId) {
                clients.set(data.userId, ws);
                ws.userId = data.userId;
            }
        } catch (e) {
            console.error("Invalid WebSocket message", e);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        if (ws.userId) {
            clients.delete(ws.userId);
        }
    });
});

// Set up lowdb with a JSON file adapter
const db = await JSONFilePreset('db.json', defaultData);

// Enable CORS
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

const getUser = (username, password) => {
    const user = db.data.users.find(u => u.username === username && u.password === password);
    return user;
}

function updateUserMoney(user, newMoney) {
    const ws = clients.get(user.id);
    if (ws && ws.readyState === ws.OPEN) {
        ws.send(JSON.stringify({ type: 'moneyUpdate', money: newMoney }));
    }
    user.money = newMoney;
}

// GET endpoint to authenticate a user
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = getUser(username, password);

    if (!user) {
        return res.status(401).json({ message: 'Credenciais invalidas!' });
    }
    return res.json(user);
})

// GET endpoint to retrieve all cards
app.get('/cards', (req, res) => {
    res.json(db.data.cards);
});

// POST endpoint to create a new card (admin only)
app.post('/cards', async (req, res) => {
    const { card, username, password } = req.body;
    const user = getUser(username, password);

    if (!user) {
        return res.status(401).json({ message: 'Credenciais invalidas!' });
    }

    if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Acesso negado!' });
    }
    if (!(card.id && card.price && card.bingoPrize && card.maxPrize)) {
        return res.status(400).json({ message: 'Dados do cartão inválidos!' });
    }
    const existingCard = db.data.cards.find(e => e.id === card.id);
    if (existingCard) {
        return res.status(400).json({ message: 'Cartão já existe!' });
    }
    
    db.data.cards.push(card);
    await db.write();
    res.status(201).json(card);
});

// GET endpoint to retrieve a specific card by ID
app.get('/cards/:id', (req, res) => {
    const cardId = parseInt(req.params.id);
    const card = db.data.cards.find(e => e.id === cardId);

    if (!card) {
        return res.status(404).json({ message: 'Cartão não encontrado!' });
    }

    res.json(card);
});

// PUT endpoint to update a card (admin only)
app.put('/cards/:id', async (req, res) => {
    const { card, username, password } = req.body;
    const user = getUser(username, password);

    if (!user) {
        return res.status(401).json({ message: 'Credenciais invalidas!' });
    }

    if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Acesso negado!' });
    }

    const cardId = parseInt(req.params.id);
    const existingCard = db.data.cards.find(e => e.id === cardId);

    if (!existingCard) {
        return res.status(404).json({ message: 'Cartão não encontrado!' });
    }

    Object.assign(existingCard, card);
    await db.write();
    res.json(existingCard);
});

// POST endpoint for user to buy a card
app.post('/cards/:id/buy', async (req, res) => {
    const { username, password } = req.body;
    const user = getUser(username, password);

    if (!user) {
        return res.status(401).json({ message: 'Credenciais invalidas!' });
    }

    const cardId = parseInt(req.params.id);
    const card = db.data.cards.find(e => e.id === cardId);

    if (!card) {
        return res.status(404).json({ message: 'Cartão não encontrado!' });
    }

    if (user.purchases.includes(cardId)) {
        return res.status(400).json({ message: 'Você já comprou este cartão!' });
    }

    if (user.money < card.price) {
        return res.status(400).json({ message: 'Saldo insuficiente!' });
    }
    updateUserMoney(user, user.money - card.price); // Deduct money from user account and stream update to WebSocket clients
    user.purchases.push(cardId); // Add card ID to user's purchases
    await db.write(); // Save changes to the database

    res.json({ message: 'Compra realizada com sucesso!', card });
});
/*
app.get('/users', (req, res) => {
    res.json(db.data.users.map(user => ({ id: user.id, username: user.username, role: user.role, money: user.money })));
});
*/
/*
app.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const user = db.data.users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado!' });
    }

    res.json({ id: user.id, username: user.username, role: user.role, money: user.money });
});
*/

// POST endpoint to add money to a user's account (admin only)
app.post('/users/:id/money', async (req, res) => {
    const { username, password, amount } = req.body;
    const user = getUser(username, password);

    if (!user) {
        return res.status(401).json({ message: 'Credenciais invalidas!' });
    }

    if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Acesso negado!' });
    }

    const userId = parseInt(req.params.id);
    const targetUser = db.data.users.find(u => u.id === userId);

    if (!targetUser) {
        return res.status(404).json({ message: 'Usuário não encontrado!' });
    }

    updateUserMoney(targetUser, targetUser.money + amount);
    await db.write(); // Save changes to the database

    res.json({ message: 'Dinheiro adicionado com sucesso!', user: targetUser });
});


// Start the server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

