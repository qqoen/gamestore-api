const express = require('express');
const { ObjectID } = require('mongodb');

const { getCollection } = require('../db');
const { Order } = require('../models');
const { isEmpty } = require('../utils');

const router = express.Router();

router.get('/', async (req, res) => {
    const coll = getCollection('orders');
    const items = await coll.find();
    const arr = await items.toArray();

    res.json(arr);
});

router.post('/', async (req, res) => {
    if (isEmpty(req.body.games) || isEmpty(req.body.userId)) {
        req.sendStatus(400);
        return;
    }

    const items = getCollection('orders');

    await items.insertOne(new Order(req.body.games, req.body.userId));

    res.sendStatus(200);
});

router.get('/:id', async (req, res) => {
    const orders = getCollection('orders');
    const users = getCollection('users');
    const games = getCollection('games');

    const orderId = ObjectID(req.params.id);
    const order = await orders.findOne({ _id: orderId });
    const userId = ObjectID(order.userId);
    const user = await users.findOne({ _id: userId });
    const orderGames = await games.find({
        _id: {
            $in: order.games.map((id) => ObjectID(id))
        }
    });

    const gamesArr = await orderGames.toArray();
    const sum = gamesArr.reduce((acc, cur) => acc + cur.price, 0);

    res.json({
        ...order,
        userName: user.fullname,
        sum
    });
});

router.put('/:id', async (req, res) => {
    if (isEmpty(req.body.games) || isEmpty(req.body.userId)) {
        req.sendStatus(400);
        return;
    }

    const items = getCollection('orders');
    const _id = ObjectID(req.params.id);

    await items.updateOne({ _id }, {
        $set: new Order(req.body.games, req.body.userId)
    });

    res.sendStatus(200);
});

router.delete('/:id', async (req, res) => {
    const items = getCollection('orders');

    try {
        const _id = ObjectID(req.params.id);
        await items.deleteOne({ _id });
        res.sendStatus(200);
    } catch (e) {
        res.sendStatus(400);
    }
});

module.exports = router;
