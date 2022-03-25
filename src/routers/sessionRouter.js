const express = require('express');
const sessions = require('../data/sessions.json');

// This line creates a router to encapsulate multiple routes.
const sessionRouter = express.Router();

// Define a static route.
sessionRouter.route('/')
    .get((req, res) => {
        res.render('sessions', { sessions });
    });

// Define a route with an argument.
sessionRouter.route('/:id')
    .get((req, res) => {
        const id = req.params.id;
        res.render('session', { session: sessions[id] });
    });

module.exports = sessionRouter;