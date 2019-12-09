const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

function getAuthUser(req) {
    // return { name: 'johnny' };
}

app.use(express.static('static'));

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/login', (req, res) => {
    console.log('here');
    console.log(JSON.stringify(req.body, null, 2));
    //todo set cookie
    res.redirect('/');
});

app.get('/', (req, res) => {
    const user = getAuthUser(req);
    if (user) {
        res.send('Hello!' + user.name);
        return;
    }
    return res.redirect('login.html');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));