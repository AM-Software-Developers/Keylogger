const express = require('express');
const router = express.Router();
const userService = require('./user.service');

// routes
router.post('/authenticate', login);

module.exports = router;

function login(req, res, next) {
    userService.login(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
        .catch(err => next(err));
}