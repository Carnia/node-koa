require("./global");

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
  // await model.sync({force:true});
})();

app.use(views('views', { map: {html: 'ejs' },//(这样配置，后缀名为.html)
// extension:'ejs',//应用ejs模板引擎
},));
app.use(timer);
app.use(log);
app.use(last);
app.use(bodyParser());
app.use(controller());
app.listen(9000);
console.log("app start");
