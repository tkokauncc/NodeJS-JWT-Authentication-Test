const express = require('express');
const app = express();


const bodyParser = require('body-parser');
const path = require('path');
const PORT = 3000;


app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Serving on port $(PORT)`);

});