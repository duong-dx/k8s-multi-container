const keys = require("./keys");

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres client setup
const { Pool } = require('pg');

const pgClient = new Pool({
    user: keys.postgresUser,
    host: keys.postgresHost,
    database: keys.postgresDatabase,
    password: keys.postgresPassword,
    port: keys.postgresPort
})

pgClient.on("connect", (client) => {
    client
        .query('CREATE TABLE IF NOT EXISTS values (number INT)')
        .catch((err) => console.error(err));
});

// Redis client setup

const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000,
});
const redisPublisher = redisClient.duplicate();

// Express route handlers

app.get('/', (req, res) => {
    res.send('hiiiiii')
})

app.get("/values/all", async (req, res) => {
    try {
        //listing messages in users mailbox
        const values = await pgClient.query('SELECT number from values');

        res.send(values.rows);
    } catch (err) {
        res.sendStatus(500).send('errr');
    }

});

app.get('/values/current', async (req, res) => {
    redisClient.hgetall('values', (err, values) => {
        res.send(values);
    });
});

app.post('/values', async (req, res) => {
    const index = req.body.index;

    if (parseInt(index) > 40) {
        return res.status(422).send('Index too high');
    }

    redisClient.hset('values', index, 'Nothing yet!');
    redisPublisher.publish('insert', index);
    pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

    res.send({ working: true });
});

app.listen(process.env.SERVER_PORT, error => { console.log('Listening on port....', error); });
