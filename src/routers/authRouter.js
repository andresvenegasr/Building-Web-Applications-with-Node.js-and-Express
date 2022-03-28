const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const debug = require('debug')('app:authRouter');
const passport = require('passport');

const authRouter = express.Router();

const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = encodeURIComponent(process.env.MONGO_PASSWORD);

authRouter.route('/sign-up')
    .post((req, res) => {
        const { username, password } = req.body;

        const url = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.8wovn.mongodb.net?retryWrites=true&w=majority`;
        const dbName = 'globomantics';

        (async function addUser(){
            let client; 
            try {
                client = await MongoClient.connect(url, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                });
                
                const db = client.db(dbName);

                const user = { username, password };
                const results = await db.collection('users').insertOne(user);
                const userRegistered = await db.collection('users').findOne({ _id: new ObjectId(results.insertedId) });

                debug(userRegistered);

                req.login(userRegistered, () => {
                    res.redirect('/auth/profile');
                });
            } catch (error) {
                debug(error.stack);
                res.end(error);
            }

            if(client !== null && client !== undefined){
                client.close();
            }
        })();
    });

authRouter.route('/sign-in')
    .get((req, res) => { res.render('signIn'); })
    .post(passport.authenticate('local', {
        successRedirect: '/auth/profile',
        failureRedirect: '/'
    }));

authRouter.route('/profile')
    .get((req, res) => {
        console.log(req.user)
        res.json(req.user);
    });

module.exports = authRouter;