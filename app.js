require("./global");//加载全局变量

const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const views = require('koa-views');

const controller = require("./controllers");// const router = require('koa-router')()
const app = new Koa();
const { last, log, timer } = require("./middleware");

// 数据库同步
const model = require("./models");
// model.sync()
(async () => {
  await model.sync();
  // await model.sync({force:true});//带上force会检查数据库，并根据models里面的模型定义强制生成新的表结构，一般是单独抽出来成一个指令，项目第一次初始化的时候执行一次，这里就懒得抽，平时用注释切换就行。
})();

app.use(views('views', { map: {html: 'ejs' },//(这样配置，controllers调用ctx.render（）的时候，会去views文件夹内找对应的文件，后缀名支持.html)
// extension:'ejs',//应用ejs模板引擎
},));
app.use(timer);
app.use(log);
app.use(last);
app.use(bodyParser());//以json形式将非GET类型的请求参数request.body挂载到ctx上
app.use(controller());//使用控制器统一管理路由
app.listen(9000);
console.log("app start");
