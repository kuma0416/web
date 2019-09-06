var express = require('express');
var bodyParser = require('body-parser');
var app = express();
const port = 3000;

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

app.get('/', function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.post('/login', function(req,res){
    console.log('account=' + req.body.acc);
    console.log('password=' + req.body.pwd);
    //console.log(req.body);
    //res.sendFile(__dirname + "/view/member.html");
    //res.send(req.body);
    //res.render('user', {name: 'tobi'});
    res.redirect('/member/id='+req.body.acc);
});

app.use('/member/:acc', function(req, res){
    res.sendFile(__dirname + "/view/member.html");
});

app.listen(port);