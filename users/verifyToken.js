const userService = require('./user.service');

function verifyToken(req, res, next) {
    userService.check(req).then((obj) => {
        next();
    }).catch((err) => {
        res.status(401).send({ auth: false, message: err.toString() });
    });
}

module.exports = verifyToken;