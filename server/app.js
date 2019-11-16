var express = require('express');
var app = express();

var cors = require('cors')
app.use(cors()); 

var bodyParser = require('body-parser');

app.use('/', express.static('../pages'))
app.use('/', express.static('../img'))

app.use(bodyParser.urlencoded({ extend: false }));

app.use(require('./log'));//登陆
app.use(require('./list'));//列表
app.use(require('./updata'));//文件
app.use(require('./download'));//下载


app.listen(3000, function() {
    console.log('server is running !!');
    console.log('http://localhost:3000');
})