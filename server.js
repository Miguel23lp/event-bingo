import express from 'express';
import cors from 'cors';
import { JSONFilePreset } from 'lowdb/node';
import { WebSocketServer } from 'ws';
import http from 'http';

const app = express();
const defaultData = {
  "users": [
    {
      "id": 1,
      "username": "adm",
      "password": "1234",
      "role": "admin",
      "money": 0,
      "purchases":[]
    },
    {
      "id": 2,
      "username": "joao",
      "password": "1234",
      "role": "user",
      "money": 500.00,
      "purchases": [
      ]
    }
  ],
  "cards": [

  ]
};

const port = 3000;

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const clients = new Map();

wss.on('connection', (ws, req) => {
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            
            if (data.type === 'register' && data.userId) {
                clients.set(data.userId, ws);
                ws.userId = data.userId;
            }
        } catch (e) {
            console.error("Invalid WebSocket message", e);
        }
    });

    ws.on('close', () => {
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

function handlePrizes(card) {
    if (card.result === "lost") return;
    let amount = 0;
    if (card.result === "bingo"){
        amount = card.bingoPrize;
    }
    else if (card.result === "fullwin"){
        amount = card.maxPrize;
    }
    else {
        throw new Error("Resultado do jogo inválido");
    }
    
    const users = db.data.users.filter(u => u.purchases.includes(card.id));
    users.forEach(user => {
        updateUserMoney(user, user.money + amount);
    });
    
}

function sortCards(cards) {
    return cards.sort((a, b) => {
        if (a.creationDate < b.creationDate) return -1;
        if (a.creationDate > b.creationDate) return 1;
        return 0;
    });
}

// Post endpoint to authenticate a user
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = getUser(username, password);

    if (!user) {
        return res.status(401).json({ message: 'Credenciais invalidas!' });
    }
    return res.json(user);
})

// POST endpoint to retrieve all users
app.post('/users', (req, res) => {
    const { username, password } = req.body;
    const user = getUser(username, password);
    if (!user) {
        return res.status(401).json({ message: 'Credenciais invalidas!' });
    }
    if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Acesso negado!' });
    }
    return res.json(db.data.users.map(user => {
        return {
            id: user.id,
            username: user.username,
            role: user.role,
        };
    }));
});

// GET endpoint to retrieve all cards
app.get('/cards', (req, res) => {
    res.json(sortCards(db.data.cards));
});

// GET endpoint to retrieve all available cards
app.get('/cards/available', (req, res) => {
    const availableCards = db.data.cards.filter(card => 
        card.cells.every(cell => !cell.won) &&
        new Date(card.date) > new Date()
    );
    res.json(sortCards(availableCards));
});

// POST endpoint to retrive all available cards for user
app.post('/cards/available/:userId', (req, res) => {
    const userId = parseInt(req.params.userId);
    const { username, password } = req.body;
    const user = getUser(username, password);
    if (!user) {
        return res.status(401).json({ message: 'Credenciais invalidas!' });
    }

    if (user.id !== userId) {
        return res.status(403).json({ message: 'Acesso negado!' });
    }

    const availableCards =  db.data.cards.filter(card => 
        card.cells.every(cell => !cell.won) &&
        new Date(card.date) > new Date() &&
        !user.purchases.includes(card.id)
    );
    res.json(sortCards(availableCards));

})

// GET endpoint to retrieve all editable cards
app.get('/cards/editable', (req, res) => {
    const editableCards = db.data.cards.filter(card => !card.finished);
    res.json(sortCards(editableCards));
});

// POST endpoint to deposit money to a user's account (admin only)
app.post('/users/:userId/deposit', async (req, res) => {
    const { username, password, amount } = req.body;
    const user = getUser(username, password);

    if (!user) {
        return res.status(401).json({ message: 'Credenciais invalidas!' });
    }

    if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Acesso negado!' });
    }

    const userId = parseInt(req.params.userId);
    const targetUser = db.data.users.find(u => u.id === userId);

    if (!targetUser) {
        return res.status(404).json({ message: 'Usuário não encontrado!' });
    }
    if (targetUser.role === 'admin') {
        return res.status(403).json({ message: 'Não é permitido adicionar dinheiro a um admin!' });
    }
    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(403).json({ message: 'Quantidade inválida!' });
    }
    updateUserMoney(targetUser, targetUser.money + amount);
    await db.write(); // Save changes to the database

    res.json({ message: 'Dinheiro adicionado com sucesso!', user: targetUser });
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
app.put('/cards/:cardId/cellWon/:cellId', async (req, res) => {
    const { username, password } = req.body;
    const user = getUser(username, password);
    if (!user) {
        return res.status(401).json({ message: 'Credenciais invalidas!' });
    }

    if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Acesso negado!' });
    }

    const cardId = parseInt(req.params.cardId);
    const card = db.data.cards.find(e => e.id === cardId);

    if (!card) {
        return res.status(404).json({ message: 'Cartão não encontrado!' });
    }

    const cellId = parseInt(req.params.cellId);
    const cell = card.cells.find(c => c.id == cellId);
    if (!cell) {
        return res.status(404).json({ message: 'Celula não encontrada!' });
    }
    cell.won = true;

    await db.write();
    res.json(card);
});

// POST endpoint for user to buy a card
app.post('/cards/:id/buy', async (req, res) => {
    const { username, password } = req.body;
    const user = getUser(username, password);

    if (!user) {
        return res.status(401).json({ message: 'Credenciais invalidas!' });
    }

    if (user.role === 'admin') {
        return res.status(403).json({ message: 'Acesso negado!' });
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

    if (card.cells.some(cell => cell.won) || card.date < new Date(Date.now())) {
        return res.status(400).json({ message: 'Cartão já não esta disponivel para compra!' });
    }

    updateUserMoney(user, user.money - card.price); // Deduct money from user account and stream update to WebSocket clients
    user.purchases.push(cardId); // Add card ID to user's purchases
    await db.write(); // Save changes to the database

    res.json({ message: 'Compra realizada com sucesso!', card });
});

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

    if (targetUser.role === 'admin') {
        return res.status(403).json({ message: 'Não é permitido adicionar dinheiro a um admin!' });
    }

    updateUserMoney(targetUser, targetUser.money + amount);
    await db.write(); // Save changes to the database

    res.json({ message: 'Dinheiro adicionado com sucesso!', user: targetUser });
});

// POST endpoint to get user's purchased cards
app.post('/users/cards', (req, res) => {
    const { username, password } = req.body;
    const user = getUser(username, password);

    if (!user) {
        return res.status(401).json({ message: 'Credenciais invalidas!' });
    }

    const purchasedCards = db.data.cards.filter(card => user.purchases.includes(card.id));
    res.json(purchasedCards);
});

// Put endpoint to mark a card as finished 
app.put('/cards/:cardId/finish', async (req, res) => {
    const { username, password } = req.body;
    const user = getUser(username, password);

    if (!user) {
        return res.status(401).json({ message: 'Credenciais invalidas!' });
    }

    if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Acesso negado!' });
    }
    const cardId = parseInt(req.params.cardId);
    const card = db.data.cards.find(e => e.id === cardId);

    if (!card) {
        return res.status(404).json({ message: 'Cartão não encontrado!' });
    }

    card.finished = true;
    card.result = checkCardWin(card);
    await db.write(); // Save changes to the database
    handlePrizes(card);

    res.json({ message: 'Cartão marcado como finalizado!', card: card });
});

// Put endpoint to mark a cell as won
app.put('/cards/:cardId/cellWon/:cellId', async (req, res) => {
    const { username, password } = req.body;
    const user = getUser(username, password);

    if (!user) {
        return res.status(401).json({ message: 'Credenciais invalidas!' });
    }

    if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Acesso negado!' });
    }
    const cardId = parseInt(req.params.cardId);
    const card = db.data.cards.find(e => e.id === cardId);
    const cellId = parseInt(req.params.cellId);
    const cell = card.cells.find(e => e.id === cellId);

    if (!cell) {
        return res.status(404).json({ message: 'Celula não encontrado!' });
    }

    cell.won = true;
    await db.write(); // Save changes to the database
    
    res.json({ message: 'Celula marcada!', cell: cell });
});

const checkCardWin = (card) => {
    const wonCells = card.cells.filter(cell => cell.won);
    if (wonCells.length === card.cells.length) {
        return "fullwin";
    }

    const freeIndex = Math.floor((card.nCols * card.nRows) / 2);
    const cells = card.cells.toSpliced(freeIndex, 0, {won: true});
    const indexAt = (row, col) => row * card.nCols + col;

    // Column bingo
    for (let col = 0; col < card.nCols; col++) {
        let bingo = true;
        for (let row = 0; row < card.nRows; row++) {
            const cell = cells[indexAt(row, col)];
            if (!cell.won) {
                bingo = false;
                break;
            }
        }
        if (bingo) {
            return "bingo";
        }
    }

    // Row bingo
    for (let row = 0; row < card.nRows; row++) {
        let bingo = true;
        for (let col = 0; col < card.nCols; col++) {
            const cell = cells[indexAt(row, col)];
            if (!cell.won) {
                bingo = false;
                break;
            }
        }
        if (bingo) {
            return "bingo";
        }
    }

    return "lost";
}

// Start the server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

