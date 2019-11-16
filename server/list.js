var express = require('express');
var routerList = express.Router();
var MongoClient = require('mongodb').MongoClient;

routerList.get('/api/list', function(req, res) {
   var url = "mongodb://localhost:27017/";
    MongoClient.connect(url, {useNewUrlParser: true}, function (err, db) {
        if (err) throw err;
        var dbo = db.db("upSystem");
        // console.log(req.query.id)
        dbo.collection("files").find({'id': req.query.id}).toArray(function (err, result) { // 返回集合中所有数据
            if (err) throw err;
            // console.log(result)
            if (result != '') {
                res.json(result)
            } else {
                res.json('filed')
            }
            db.close();
        });
    });
})

// res.redirect('/');

module.exports = routerList;
//登陆