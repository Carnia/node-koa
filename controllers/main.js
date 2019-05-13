const query=require('../db')
let fn_home = async (ctx, next) => {
  let data=await query('SELECT * FROM demo')
  console.log(data)
  ctx.response.body = '<h1>hello</h1>'
}
module.exports={
  'GET /':fn_home,
}