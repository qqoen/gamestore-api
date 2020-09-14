const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');

dotenv.config();

const dbname = process.env.DB_NAME;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@maincluster.9m2ao.mongodb.net/${dbname}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

function getCollection(name) {
    const db = client.db(dbname);
    return db.collection(name);
}

module.exports = { client, getCollection };
