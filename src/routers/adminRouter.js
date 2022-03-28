const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:adminRouter');

const adminRouter = express.Router();

const sessions = require('../data/sessions.json');

const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = encodeURIComponent(process.env.MONGO_PASSWORD);

adminRouter.route('/')
    .get((req, res) => {
        const url = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.8wovn.mongodb.net?retryWrites=true&w=majority`;
        const dbName = 'globomantics';

        (async function mongo() {
            let client; 

            try {
                client = await MongoClient.connect(url, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                });
                
                const db = client.db(dbName);

                const response = await db.collection('sessions').insertMany(sessions);

                res.json(response);
            } catch (error) {
                debug(error.stack);
                res.end(error);
            }
            
            if(client !== null && client !== undefined){
                client.close();
            }
          })();
    });

module.exports = adminRouter;