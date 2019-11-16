var express = require('express');
var routerLog = express.Router();
var MongoClient = require('mongodb').MongoClient;
routerLog.post('/api/log/login', function (req, res) {
    var url = "mongodb://localhost:27017/";
    
    MongoClient.connect(url, {useNewUrlParser: true}, function (err, db) {
        if (err) throw err;
        // console.log(req.body.id)
        if(req.body.id == ''){
           res.json('filed')
           return 
        }
        var dbo = db.db("upSystem");
        var myobj = {
            id:req.body.id,
            name: req.body.name,
            pwd: req.body.pwd
        };
        dbo.collection("logInfo").find({'id': req.body.id}).toArray(function (err, result1) {
            console.log(result1)
            if(result1 == '') {
                console.log(123)
                    dbo.collection("logInfo").insertOne(myobj, function (err, result) {
                        if (err) throw err;
                        console.log("文档插入成功");
                        db.close();
                        res.end('success')
                    });
                    db.close();
                    return
            }else{
                console.log(456)
                    res.end('filed111')
                    db.close();
                    return
            }
        });
       
    });
})
routerLog.post('/api/log/signup', function (req, res) {
    var url = "mongodb://localhost:27017/";
    MongoClient.connect(url, {
        useNewUrlParser: true
    }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("upSystem");
        dbo.collection("logInfo").find({'id': req.body.id}).toArray(function (err, result) { // 返回集合中所有数据
            if (err) throw err;
            console.log(result)
            if ((result != '') && (req.body.pwd == result[0].pwd)) {
                res.json(req.body.id)
            } else {
                res.json('filed')
            }
            db.close();
        });
    });
})

routerLog.get('/api/getinfo', function (req, res) {
    var url = "mongodb://localhost:27017/";
    MongoClient.connect(url, {
        useNewUrlParser: true
    }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("upSystem");
        dbo.collection("logInfo").find({'id': req.query.id}).toArray(function (err, result) { // 返回集合中所有数据
            if (err) throw err;
            // console.log(result)
            if (result != '') {
                res.json(result[0])
            } else {
                res.json('filed')
            }
            db.close();
        });
    });
})
// res.redirect('/');

module.exports = routerLog;
//登陆