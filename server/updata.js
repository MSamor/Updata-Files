const express = require('express')
var routerUpFile = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
var MongoClient = require('mongodb').MongoClient;

var files = 'null';
var upload = multer({
    dest: files
});

//后台控制文件夹创建接口
routerUpFile.get('/api/fileFolder', function (req, res) {
    files = req.query.folderName
    multer({
        dest: files
    });
    res.end('ok')
})


// app.use(upload.single('test'));


routerUpFile.post('/api/upfiles', upload.single('test'), function (req, res) {
    var myDate = new Date();
    var url = "mongodb://localhost:27017/";
    console.log(req.body)
    console.log(req.file)
    files = req.body.selected

    MongoClient.connect(url, {
        useNewUrlParser: true
    }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("upSystem");
        var myobj = {
            id: req.body.id,
            filename: req.body.id + '-' +  req.file.originalname,
            time: myDate.toLocaleString(),
            classify: req.body.selected,
            Remarks: req.body.bz
        };
        dbo.collection("files").find({
            'filename': req.body.id + '-' +  req.file.originalname,
            'classify': req.body.selected
        }).toArray(function (err, result0) {
            if (err) throw err;
            console.log(req.query)
            if (result0 != '' || req.body.id == 'undefined') {
                res.json("exits");
                console.log('exits');
                db.close();
                fs.unlink('null' + '\\' + req.file.filename, function () {})
                return;
            } else {
                dbo.collection("files").insertOne(myobj, function (err, result) {
                    if (err) throw err;

                    console.log('success');
                    db.close();

                    //文件上传
                    if (!req.file) {
                        // res.end('没有文件！')
                        return;
                    }
                    var newName = files + '\\' + req.body.id + '-' + req.file.originalname ;
                    console.log(newName)
                    fs.rename(req.file.path, newName, function (err) {
                        if (err) {
                            // res.json('上传失败')
                        } else {
                            console.log('cg')
                            res.json("success");
                            // res.json('上传成功')
                        }
                    })

                });



            }
        });

    });
})

routerUpFile.get('/api/del', function (req, res) {
    var url = "mongodb://localhost:27017/";
    req.query.name = req.query.name.toString()
    files = req.query.fileName
console.log(req.query)
    MongoClient.connect(url, {
        useNewUrlParser: true
    }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("upSystem");
        var whereStr = {
            "filename": req.query.name,
            'classify': req.query.fileName
        }; // 查询条件
        dbo.collection("files").deleteOne(whereStr, function (err, obj) {
            if (err) throw err;
            console.log("数据库文档删除成功");
            db.close();
            var newName = files + '\\'+req.query.name;
            console.log("新名字："+newName);
            fs.unlink(newName, function () {
                console.log('删除成功')
                res.json('success')
            })
        });
    });


})

module.exports = routerUpFile;