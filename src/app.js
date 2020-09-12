const dotenv = require('dotenv');
const express = require('express');
const jwt = require('jsonwebtoken');

const { client } = require('./db');
const games = require('./routes/games');
const categories = require('./routes/categories');
const orders = require('./routes/orders');

dotenv.config();

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    if (req.path === '/login') {
        next();
        return;
    }

    const authHeader = req.headers['authorization'];
    const reqToken = authHeader && authHeader.split(' ')[1]

    if (reqToken == null) {
        res.sendStatus(401);
        return;
    }

    jwt.verify(reqToken, process.env.SECRET, (err) => {
        if (err != null) {
            console.error(err)
            res.sendStatus(401);
            return;
        }

        next();
    });
});

app.use((req, res, next) => {
    console.log(req.method, req.path);
    next();
});

app.use('/games', games);
app.use('/categories', categories);
app.use('/orders', orders);

app.post('/login', (req, res) => {
    const login = req.body.login;

    if (login !== 'admin') {
        res.sendStatus(401);
        return;
    }

    const token = jwt.sign({ login }, process.env.SECRET);

    res.json(token);
});

console.log('Connecting to db...');

client.connect((err) => {
    if (err != null) {
        console.error(err);
        return;
    }

    app.listen(process.env.PORT, () => {
        console.log(`Listening at http://localhost:${process.env.PORT}`);
    });
});
