require("./global"); //加载全局变量

const path = require("path");
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const handleStatic = require('koa-static-match-path')
const views = require("koa-views");
const serve = require("koa-static");
const app = new Koa();

const controller = require("./controllers"); // const router = require('koa-router')()
const { last, log, timer } = require("./middleware");

// 数据库同步
const model = require("./models");
// model.sync()
(async () => {
  await model.sync();
  // await model.sync({force:true});
  //带上force会检查数据库，并根据models里面的模型定义强制生成新的表结构
  //一般是单独抽出来成一个指令，项目第一次初始化的时候执行一次，这里就懒得抽，平时用注释切换就行。
})();

// 静态资源服务
// 可以同时使用多个koa-static实例去对应多个文件夹（注意多文件夹同文件名问题）
const staticServe1 = serve(path.join(__dirname,"public"));
app.use(staticServe1);

// 文件上传处理中间件
const koaBody = require("koa-body");
app.use(
  koaBody({
    multipart: true,
    formidable: {
      maxFileSize: 200 * 1024 * 1024, // 设置上传文件大小最大限制，默认2M
      uploadDir: "public/upload/",
      // 配置中自带了onFileBegin勾子，但是并不灵活，因为也许不是每个文件都要重命名。
      onFileBegin: (name, file) => {
        // 文件存储之前对文件进行重命名处理
        // const fileFormat = file.name.split(".");
        // file.name = `${Date.now()}.${fileFormat[fileFormat.length - 1]}`;
        // file.path = `public/upload/${file.name}`;
        // console.log(file);
      }
    }
  })
);

// 模板引擎中间件
app.use(
  views("views", {
    map: { html: "ejs" } //(这样配置，controllers调用ctx.render（）的时候，会去views文件夹内找对应的文件，后缀名支持.html)
    // extension:'ejs',//应用ejs模板引擎
  })
);
app.use(timer);
app.use(log);
app.use(last);
app.use(bodyParser()); //以json形式将非GET类型的请求参数request.body挂载到ctx上
app.use(controller()); //使用控制器统一管理路由
app.use(handleStatic(path.join(__dirname,'./public/'),'static'))
app.listen(9000);
console.log("app start ：localhost:9000");
