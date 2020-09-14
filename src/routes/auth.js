const express = require('express');
const jwt = require('jsonwebtoken');

const { getCollection } = require('../db');
const { User } = require('../models');
const { isEmpty } = require('../utils');

const router = express.Router();

router.post('/login', async (req, res) => {
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

router.post('/register', async (req, res) => {
    if (isEmpty(req.body.login) || isEmpty(req.body.password) || isEmpty(req.body.fullname)) {
        res.sendStatus(400);
        return;
    }

    const items = getCollection('users');

    await items.insertOne(new User(req.body.login, req.body.password, req.body.fullname));

    res.sendStatus(200);
});

router.get('/users', async (req, res) => {
    const coll = getCollection('users');
    const items = await coll.find();
    const arr = await items.toArray();

    res.json(arr);
});

module.exports = router;
