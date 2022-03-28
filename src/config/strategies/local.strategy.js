const passport = require('passport');
const { MongoClient } = require('mongodb');
const { Strategy } = require('passport-local');
const debug = require('debug')('app:localStrategy');

const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = encodeURIComponent(process.env.MONGO_PASSWORD);

module.exports = function localStrategy(){
    passport.use(new Strategy({
        usernameField: 'username',
        passwordField: 'password'
    }, (username, password, done) => {
        
        const url = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.8wovn.mongodb.net?retryWrites=true&w=majority`;
        const dbName = 'globomantics';

        (async function getUser(){
            let client; 
            try {
                client = await MongoClient.connect(url, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                });
                
                const db = client.db(dbName);

                const user = await db.collection('users').findOne({ username });

                if(user && user.password === password){
                    done(null, user);
                } else {
                    done(null, false);
                }
            } catch (error) {
                debug(error.stack);
                done(error, null);
            }

            if(client !== null && client !== undefined){
                client.close();
            }
        })();
    }));
};