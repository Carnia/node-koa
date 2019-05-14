// 先导入fs模块，然后用readdirSync列出文件
let fs = require("fs");
function log() {
  console.log("【controller】", ...arguments);
}
// 这里可以用sync是因为启动时只运行一次，不存在性能问题:
function addMapping(router, mapping) {
  for (var url in mapping) {
    if (url.startsWith("GET ")) {
      var path = url.substring(4);
      router.get(path, mapping[url]);
      log(`register URL mapping: GET ${path}`);
    } else if (url.startsWith("POST ")) {
      var path = url.substring(5);
      router.post(path, mapping[url]);
      log(`register URL mapping: POST ${path}`);
    } else {
      log(`!!!!invalid URL: ${url}`);
    }
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
    let mapping = require(`${path}/${f}`);
    addMapping(router, mapping);
  }
}

module.exports = function(dir) {
  let controllers_dir = dir || __dirname, // 如果不传参数，扫描目录默认为当前目录 'controllers',app.js传参：app.use(controller(__dirname+'/controllers'))
    router = require("koa-router")();
  addControllers(router, controllers_dir);
  return router.routes();
};
