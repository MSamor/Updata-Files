var express = require('express');
var routerDownload = express.Router();
var fs = require('fs');
const compressing = require('compressing');
var MongoClient = require('mongodb').MongoClient;

var names= [];

routerDownload.get('/api/getList', function (req, res) {
    //获取文件夹名称
    let components = []
        const files = fs.readdirSync('./')
        files.forEach(function (item, index) {
        let stat = fs.lstatSync('./' + item)
        if (stat.isDirectory() === true) { 
          if(item != 'dist'){
            components.push(item)
          }
        }
    })
res.json(components);

})
routerDownload.get('/api/getFilesList', function (req, res) {
    //通过名称获取文件里面的名字
    var url = "mongodb://localhost:27017/";
    if(req.query.fileName){
        MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
            if (err) throw err;
            var dbo = db.db("upSystem");
            dbo.collection('files').aggregate([
              { $lookup:
                 {
                   from: 'logInfo',            // 右集合
                   localField: 'id',    // 左集合 join 字段
                   foreignField: 'id',         // 右集合 join 字段
                   as: 'orderdetails'           // 新生成字段（类型array）
                 }
               }
              ]).toArray(function(err, res0) {
              if (err) throw err;
              for(let i=0;i<res0.length;i++){
                  if(res0[i].classify == req.query.fileName){
                      names.push(res0[i].orderdetails[0].name)
                  }
              }
              res.json(names)
              names = []
              db.close();
            });
          });
    }
})
routerDownload.get('/api/downloadFolder', function (req, res) {
    //下载文件夹 1. 先打包当前文件夹 2. 打包完成调用下载
    //通过文件夹名下载文件

    req.query.folderName = req.query.folderName.toString();
    compressing.zip.compressDir('./'+req.query.folderName, './dist'+'/'+req.query.folderName + '.zip')
        .then(() => {
            console.log('开始下载');
            res.download(__dirname+'\\dist'+'\\'+req.query.folderName+'.zip')
        })
        .catch(err => {
            console.error(err);
            return;
        });
})


module.exports = routerDownload;
