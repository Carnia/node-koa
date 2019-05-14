let main = async function (ctx, next) {
  await next();
  ctx.response.type = 'text/html'
}
let _log = async function (ctx, next) {
  console.log(`-------receive：${ctx.request.method} ${ctx.request.url}`)
  await next()
}
let timer = async function (ctx, next) {
  console.time('服务耗时')
  await next()
  console.timeEnd('服务耗时')
}
module.exports = {
  main,
  _log,
  timer
}