const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const debug = require('debug')('app:sessionRouter');
const sessions = require('../data/sessions.json');

const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = encodeURIComponent(process.env.MONGO_PASSWORD);

// This line creates a router to encapsulate multiple routes.
const sessionRouter = express.Router();
sessionRouter.use((req, res, next) => {
    if(req.user){
        next();
    } else {
        res.redirect('/auth/sign-in');
    }
});

// Define a static route.
sessionRouter.route('/')
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

                const sessions = await db.collection('sessions').find().toArray();

                res.render('sessions', { sessions });
            } catch (error) {
                debug(error.stack);
                res.end(error);
            }
            
            if(client !== null && client !== undefined){
                client.close();
            }
          })();
    });

// Define a route with an argument.
sessionRouter.route('/:id')
    .get((req, res) => {
        const id = req.params.id;
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

                const session = await db.collection('sessions').findOne({ _id: new ObjectId(id) });

                res.render('session', { session });
            } catch (error) {
                debug(error.stack);
                res.end(error);
            }
            
            if(client !== null && client !== undefined){
                client.close();
            }
          })();
    });

module.exports = sessionRouter;