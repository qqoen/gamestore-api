const dotenv = require('dotenv');
const express = require('express');
const morgan = require('morgan');

const { client } = require('./db');
const authMw = require('./middleware/auth');
const games = require('./routes/games');
const categories = require('./routes/categories');
const orders = require('./routes/orders');
const auth = require('./routes/auth');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(authMw);
app.use(morgan('tiny'));

// Routes
app.use('/games', games);
app.use('/categories', categories);
app.use('/orders', orders);
app.use(auth);

// Init

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
