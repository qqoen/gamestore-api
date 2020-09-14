const express = require('express');
const { ObjectID } = require('mongodb');

const { getCollection } = require('../db');
const { Game } = require('../models');
const { isEmpty } = require('../utils');

const router = express.Router();

router.get('/', async (req, res) => {
    const gamesColl = getCollection('games');
    const { priceFrom, priceTo, categories } = req.query;
    const search = {};

    if (!isEmpty(priceFrom) || !isEmpty(priceTo)) {
        search.price = {};

        if (!isEmpty(priceFrom)) {
            search.price.$gte = parseInt(priceFrom);
        } else {
            search.price.$lte = parseInt(priceTo);
        }
    }

    if (!isEmpty(categories)) {
        search.categories = {
            $all: JSON.parse(categories)
        };
    }

    const games = await gamesColl.find(search);
    const arr = await games.toArray();

    res.json(arr);
});

router.post('/', async (req, res) => {
    if (isEmpty(req.body.title) || isEmpty(req.body.price) || isEmpty(req.body.categories)) {
        req.sendStatus(400);
        return;
    }

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
    if (isEmpty(req.body.title) || isEmpty(req.body.price) || isEmpty(req.body.categories)) {
        req.sendStatus(400);
        return;
    }

    const games = getCollection('games');
    const _id = ObjectID(req.params.id);

    await games.updateOne({ _id }, {
        $set: new Game(req.body.title, req.body.price, req.body.categories)
    });

    res.sendStatus(200);
});

router.delete('/:id', async (req, res) => {
    const games = getCollection('games');

    try {
        const _id = ObjectID(req.params.id);
        await games.deleteOne({ _id });
        res.sendStatus(200);
    } catch (e) {
        res.sendStatus(400);
    }
});

module.exports = router;
