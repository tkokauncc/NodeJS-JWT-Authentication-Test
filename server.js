const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); 
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 3000;
const secretKey = 'MySuperSecretKey'; 

const jwtMW = exjwt({
    secret: secretKey,
    algorithms: ['HS256']
});

let users = [
    {
        id: 1,
        username: 'tejal',
        password: '123', 
    },
    {
        id: 2,
        username: 'koka',
        password: '456',
    },
];

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    let userFound = false;

    for (let user of users) {
        if (username === user.username && password === user.password) {
            let token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '3m' }); 
            res.json({
                success: true,
                err: null,
                token,
            });
            userFound = true;
            break;
        }
    }

    if (!userFound) {
        res.status(401).json({
            success: false,
            token: null,
            err: 'Username or password is incorrect',
        });
    }
});

app.get('/api/dashboard', jwtMW, (req, res) => {
    res.json({
        success: true,
        myContent: 'Secret content that only logged-in people can see',
    });
});

app.get('/api/settings', jwtMW, (req, res) => {
    res.json({
        success: true,
        settingsContent: 'This is a protected settings page',
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({
            success: false,
            officialError: err,
            err: 'Unauthorized: Invalid token',
        });
    } else {
        next(err);
    }
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
