// 先导入fs模块，然后用readdirSync列出文件
let fs = require("fs");
function log() {
  console.log("【controller】", ...arguments);
}
// 这里可以用sync是因为启动时只运行一次，不存在性能问题:
function addMapping(router, controllerMap) {
  //mtUrl是类似 DELETE /delete的字符串，由方法名和具体地址组成
  for (var mtUrl in controllerMap) {
    let method = mtUrl.split(" ")[0];
    let path = mtUrl.substring(method.length + 1);
    router[method.toLowerCase()](path, controllerMap[mtUrl]);
    log(`register URL controllerMap: ${method} ${path}`);
    // if (mtUrl.startsWith("GET ")) {
    //   var path = mtUrl.substring(4);
    //   router.get(path, controllerMap[mtUrl]);
    //   log(`register URL controllerMap: GET ${path}`);
    // } else if (mtUrl.startsWith("POST ")) {
    //   var path = mtUrl.substring(5);
    //   router.post(path, controllerMap[mtUrl]);
    //   log(`register URL controllerMap: POST ${path}`);
    // } else {
    //   log(`【error】invalid URL: ${mtUrl}`);
    // }
  }
}

function addControllers(router, dirName) {
  let path = dirName || __dirname;
  var files = fs.readdirSync(path);
  var js_files = files.filter(f => {
    return f.endsWith(".js") && !f.includes("index");
  });

  for (var f of js_files) {
    log(`process controller: ${f}...`);
    let controllerMap = require(`${path}/${f}`);
    addMapping(router, controllerMap);
  }
}

module.exports = function(dir) {
  let controllers_dir = dir || __dirname, // 如果不传参数，扫描目录默认为当前目录 'controllers',app.js传参：app.use(controller(__dirname+'/controllers'))
    router = require("koa-router")();
  addControllers(router, controllers_dir);
  return router.routes();
};
