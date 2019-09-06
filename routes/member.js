var express = require('express');
var router = express.Router();

router.get('/member', function(req, res){
    res.send("login success~~");
});