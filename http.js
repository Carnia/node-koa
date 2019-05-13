'use strict';

let http = require('http')
var path = require('path');
var fs = require('fs');
var url = require('url')
let root = path.resolve(process.argv[2] || '.');

// 解析当前目录:
// var workDir = path.resolve('.'); // '/Users/michael'

let server = http.createServer((req, res) => {
  console.log('请求：', req.url)
  let pathname = url.parse(req.url).pathname
  let filePath = path.join(root, pathname);
  console.log(filePath)
  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      // 没有出错并且文件存在:
      console.log('200 ' + req.url);
      // 发送200响应:
      res.writeHead(200);
      // 将文件流导向res:
      fs.createReadStream(filePath,'utf-8').pipe(res);
    } else {
      // 出错了或者文件不存在:
      console.log('404 ' + req.url);
      // 发送404响应:
      res.writeHead(404);
      res.end('404 Not Found');
    }
  })
})
server.listen(9000)
console.log('服务已开启：9000端口')