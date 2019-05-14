const model = require('../models/index.js');
let
  User = model.User;


let fn_home = async (ctx, next) => {
  var user = await User.findOne({
    where: {
      email: '1@qq.com',
    }
  });
  console.log(user)
  ctx.response.body = '<h1>hello</h1>' + `<div>${JSON.stringify(user)}</div>`
}
module.exports = {
  'GET /': fn_home,
}