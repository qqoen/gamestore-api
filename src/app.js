const dotenv = require('dotenv');
const express = require('express');
const jwt = require('jsonwebtoken');

const { client, getCollection } = require('./db');
const { User } = require('./models');
const { isEmpty } = require('./utils');
const games = require('./routes/games');
const categories = require('./routes/categories');
const orders = require('./routes/orders');

dotenv.config();

const app = express();

app.use(express.json());

// Authorization check
app.use((req, res, next) => {
    const noAuthPaths = ['/login', '/register'];

    if (noAuthPaths.includes(req.path)) {
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

// Logging
app.use((req, res, next) => {
    console.log(req.method, req.path);
    next();
});

app.use('/games', games);
app.use('/categories', categories);
app.use('/orders', orders);

app.post('/login', async (req, res) => {
    const { login, password } = req.body;

    const items = getCollection('users');
    const item = await items.findOne({ login, password });

    if (item != null) {
        const token = jwt.sign({ login }, process.env.SECRET);
        res.json(token);
    } else {
        res.sendStatus(401);
    }
});

app.post('/register', async (req, res) => {
    if (isEmpty(req.body.login) || isEmpty(req.body.password) || isEmpty(req.body.fullname)) {
        res.sendStatus(400);
        return;
    }

    const items = getCollection('users');

    await items.insertOne(new User(req.body.login, req.body.password, req.body.fullname));

    res.sendStatus(200);
});

app.get('/users', async (req, res) => {
    const coll = getCollection('users');
    const items = await coll.find();
    const arr = await items.toArray();

    res.json(arr);
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
