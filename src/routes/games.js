const express = require('express');
const { ObjectID } = require('mongodb');

const { getCollection } = require('../db');
const { Game } = require('../models');

const router = express.Router();

router.get('/', async (req, res) => {
    const gamesColl = getCollection('games');

    const search = {
        price: {
            $gte: parseInt(req.query.priceFrom),
            $lte: parseInt(req.query.priceTo)
        }
    };

    if (req.query.categories != null && req.query.categories !== '') {
        search.categories = {
            $all: JSON.parse(req.query.categories)
        };
    }

    const games = await gamesColl.find(search);

    const arr = await games.toArray();

    res.json(arr);
});

router.post('/', async (req, res) => {
    const games = getCollection('games');

    await games.insertOne(new Game(req.body.title, req.body.price, req.body.categories));

    res.sendStatus(200);
});

router.get('/:id', async (req, res) => {
    const games = getCollection('games');
    const _id = ObjectID(req.params.id);
    const game = await games.findOne({ _id });

    res.json(game);
});

router.put('/:id', async (req, res) => {
    const games = getCollection('games');
    const _id = ObjectID(req.params.id);

    await games.updateOne({ _id }, new Game(req.body.title, req.body.price, req.body.categories));

    res.sendStatus(200);
});

router.delete('/:id', async (req, res) => {
    const games = getCollection('games');
    const _id = ObjectID(req.params.id);
    await games.deleteOne({ _id });

    res.sendStatus(200);
});

module.exports = router;
