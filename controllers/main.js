let fn_home = async (ctx, next) => {
  ctx.response.body = '<h1>hello</h1>'
}
module.exports={
  'GET /':fn_home,
}