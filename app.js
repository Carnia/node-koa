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
<<<<<<< HEAD
// model.sync()
(async()=>{
  await model.sync()
})()
=======
model.sync()
// (async()=>{
//   await model.sync()()
// })()
>>>>>>> 9b46f588721767c347f9eaa42bd16d9dc3727f9b

app.use(timer)
app.use(_log)
app.use(main)
app.use(bodyParser())
app.use(controller())
app.listen(9000)
console.log('app start')