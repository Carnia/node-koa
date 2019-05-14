const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
// const router = require('koa-router')()
const controller = require('./controllers');
const app = new Koa()
const {
  main,
  _log,
  timer
} = require('./middleware/index.js')


const model = require('./models');
// model.sync()
(async()=>{
  await model.sync()
})()

app.use(timer)
app.use(_log)
app.use(main)
app.use(bodyParser())
app.use(controller())
app.listen(9000)
console.log('app start')