require('dotenv').config();

const express = require('express');

// Use this package to add colors in the messages. ie: chalk.green 
const chalk = require('chalk');

// Enable debug messages only when the app is executed in debug mode.
// command: DEBUG=* node app.js (* can be changed for the level of debug)
const debug = require('debug')('app');

// Morgan is a middleware to get the all information about the request.
const morgan = require('morgan');

// Is to consult the path of the application.
const path = require('path');

// Needed to configure the authentication and authorization in the project
// For more information, visit the following page: 
// https://www.npmjs.com/package/passport
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const PORT = process.env.PORT || 3000;
const app = express();

const sessionRouter = require('./src/routers/sessionRouter');
const adminRouter = require('./src/routers/adminRouter');
const authRouter = require('./src/routers/authRouter');

/* 
    Configuration of morgan, this line can be configurated with
    2 different parameters:
       -> combined: Shows all data of the request.
       -> tiny: Shows only most relevant data of the request.
*/ 
app.use(morgan('tiny'));

// This line configures the express to serve the static files in public folder.
app.use(express.static(path.join(__dirname, '/public')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configure the cookie parser and the sessions
app.use(cookieParser());
app.use(session({ 
    secret: 'globomantics',
    resave: false,
    saveUninitialized: true
}));

require('./src/config/passport.config')(app);

// Define the views directory
app.set('views', './src/views');
// Set the template enginee
app.set('view engine', 'ejs');

app.use('/sessions', sessionRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
    res.render('index', { 
        title: 'VenegasDev',
        data: ['a', 'b', 'c']
    });
});

app.listen(PORT, () => {
    // Example of usage of debug and chalk
    debug(`Listening on port ${chalk.green(PORT)}`);
});