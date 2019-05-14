require("./global");

const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
// const router = require('koa-router')()
const controller = require("./controllers");
const app = new Koa();
const { last, log, timer } = require("./middleware");

const model = require("./models");
// model.sync()
(async () => {
  await model.sync();
})();

app.use(timer);
app.use(log);
app.use(last);
app.use(bodyParser());
app.use(controller());
app.listen(9000);
console.log("app start");
