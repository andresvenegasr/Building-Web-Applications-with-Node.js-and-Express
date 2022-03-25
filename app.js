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

const app = express();

/* 
    Configuration of morgan, this line can be configurated with
    2 different parameters:
       -> combined: Shows all data of the request.
       -> tiny: Shows only most relevant data of the request.
*/ 
app.use(morgan('tiny'));

// This line configures the express to serve the static files in public folder.
app.use(express.static(path.join(__dirname, '/public')));

app.get('/', (req, res) => {
    res.send('Hello from my app.');
});

app.listen(3000, () => {
    // Example of usage of debug and chalk
    debug(`Listening on port ${chalk.green('3000')}`);
});