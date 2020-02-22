const config = require('./../config');
const jwt = require('jsonwebtoken');
const Role = config.roles;

// users hardcoded for simplicity, store in a db for production applications
const users = [
    { id: 1, username: 'admin', password: 'admin', firstName: 'Admin', lastName: 'User', role: Role.admin },
    { id: 2, username: 'superuser', password: 'superuser', firstName: 'Super', lastName: 'User', role: Role.superuser }
];

module.exports = {
    check,
    login
};

async function login({ username, password }) {
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        const token = jwt.sign({ id: user.id, role: user.role }, config.secret);
        const { password, ...userWithoutPassword } = user;
        return {
            ...userWithoutPassword,
            token
        };
    }
}

async function check(req) {

    var token = req.headers['authorization'];
    if (!token || !token.split(' ')[1])
        throw new Error('No token provided');
    var decoded = await jwt.verify(token.split(' ')[1], config.secret);
    console.log(decoded);
    req.userId = decoded.id;
    req.roles = decoded.role;
    
    return true;
}
