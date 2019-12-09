const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const MemoryStorage = require('memorystorage');
const userStorage = new MemoryStorage('users');
var session = require('express-session')

const app = express();
const port = 3001;

const saltRounds = 10;

function getAuthUser(req) {
    // get user by cookie
    // return { name: 'johnny' };
}

function checkPassword(password, user) {
    console.log('calling compare', password, user.hash);
    return bcrypt.compare(password, user.hash);
}

function createUser(data, cb) {
    const user = { username: data.username };
    bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(data.password, salt, function (err, hash) {
            user.hash = hash;
            console.log('storing user ', user);
            userStorage.setItem(user.username, user);
            cb();
        });
    });
}

app.use(express.static('static'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    cookie: { maxAge: 86400000 },
    secret: 'keyboard cat'
}))

app.post('/login', (req, res) => {
    console.log('here');
    console.log(JSON.stringify(req.body, null, 2));
    if (!(req.body && req.body.username && req.body.password)) {
        res.redirect('/login.html?no_credentials');
        return;
    }
    const user = userStorage.getItem(req.body.username);
    console.log('found user', user);
    if (!user) {
        res.redirect('/login.html?user_not_found');
        return;
    }

    checkPassword(req.body.password, user)
        .then((authenticated) => {
        if (!authenticated) {
            res.redirect('/login.html?invalid_password');
            return;
        }
        console.log('login success', user);
        req.session.user=user;
        res.redirect('/?success');
    })
        .catch(console.error);
});


app.post('/signup', (req, res) => {
    if (!(req.body && req.body.username && req.body.password)) {
        console.log('invalid signup');
        res.redirect('/signup.html');
    }
    createUser(req.body, () => {
        console.log('signup done');
        res.redirect('/');
    });
});

app.get('/', (req, res) => {
    const user = req.session.user;
    if (user) {
        res.send('Hello!' + req.session.user.username);
        return;
    }
    return res.redirect('login.html');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));