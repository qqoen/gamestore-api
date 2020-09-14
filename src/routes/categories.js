const express = require('express');
const { ObjectID } = require('mongodb');

const { getCollection } = require('../db');
const { Category } = require('../models');
const { isEmpty } = require('../utils');

const router = express.Router();

router.get('/', async (req, res) => {
    const coll = getCollection('categories');
    const items = await coll.find();
    const arr = await items.toArray();

    res.json(arr);
});

router.post('/', async (req, res) => {
    if (isEmpty(req.body.name)) {
        req.sendStatus(400);
        return;
    }

    const items = getCollection('categories');

    await items.insertOne(new Category(req.body.name));

    res.sendStatus(200);
});

router.get('/:id', async (req, res) => {
    const items = getCollection('categories');
    const _id = ObjectID(req.params.id);
    const item = await items.findOne({ _id });

    res.json(item);
});

router.put('/:id', async (req, res) => {
    if (isEmpty(req.body.name)) {
        req.sendStatus(400);
        return;
    }

    const items = getCollection('categories');
    const _id = ObjectID(req.params.id);

    await items.updateOne({ _id }, {
        $set: new Category(req.body.name)
    });

    res.sendStatus(200);
});

router.delete('/:id', async (req, res) => {
    const items = getCollection('categories');

    try {
        const _id = ObjectID(req.params.id);
        await items.deleteOne({ _id });
        res.sendStatus(200);
    } catch (e) {
        res.sendStatus(400);
    }
});

module.exports = router;
