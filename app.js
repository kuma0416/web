var express = require('express');
var bodyParser = require('body-parser');
var app = express();
const port = 3000;
var fs = require('fs');
var session = require('express-session');
var db = require('./db');
var crypto = require('crypto');

function render(filename, params) {
    var data = fs.readFileSync(filename, 'utf8');
    for (var key in params) {
      data = data.replace('{' + key + '}', params[key]);
    }
return data;
}

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.get('/', function(req, res){
    var username = req.session.username;
    var isAdmin = false;
    if (username) {
        isAdmin = true;
    }

    db.getPosts(function(err, posts){
        if (err){
            res.send(err);
        } else {
            res.render('index', {
                username: username,
                isAdmin: isAdmin,
                posts: posts
            });
        }
    })
});

app.post('/', function(req, res){
    author = req.session.username;
    itemName = req.body.itemName;
    team = req.body.team;
    var id=crypto.randomBytes(32).toString('hex').substr(0,9);
    db.addPost({
        author: author,
        itemName: itemName,
        team: team,
        id: id
    }, function(err, data){
        if(err){
            res.send(err);
        } else {
            res.redirect('/');
        }
    })
});

app.get('/posts/delete/:id', function(req, res){
    var id = req.params.id;
    db.deletePost(id, function (err) {
    if (err) {
      res.send(err);
    } else {
        console.log(id);
      res.redirect('/');
    }
  })
})

app.get('/login', function(req,res){
    res.render('login');
});

app.post('/login', function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    db.loginCheck(function(err, data){
        if(err){
            res.send(err);
        } else {
            var count = data.length
            for(var i=0;i<count;i++){
                if(username == data[i].username && password == data[i].password){
                    console.log("login success!");
                    req.session.username = username;
                }
            }
            res.redirect('/');
        }
    })
})

app.get('/logout', function(req, res){
    req.session.destroy();
    res.redirect('/');
});

app.listen(port);