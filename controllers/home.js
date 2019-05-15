const model = require("../models/index.js");
const sequelize = require("sequelize");
let User = model.User;

const Op = model.Op;
let fn_home = async (ctx, next) => {
  let pageNumber = +ctx.query.p || PAGENUMBER;
  let pagesize = +ctx.query.s || PAGESIZE;
  var user;
  // for(let i =0;i<100;i++){
  // user = await User.create({
  //   email: Math.ceil(Math.random()*10000)+'@qq.com',
  //   passwd: Math.random()*10,
  //   name: 'xh',
  //   gender: true
  // })
  // }
  user = await User.findAndCountAll({
    offset: (pageNumber - 1) * pagesize,
    attributes: { exclude: ['createdAt','updatedAt','version'] },
    limit: pagesize
    //  attributes: { include: [[sequelize.fn('COUNT', sequelize.col('email')), 'count']] }
    //  attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'count']]
    // where: {
    //   [Op.or]: [{email: '1@qq.com',},{email: '2@qq.com',}]
    // }
  });
  await ctx.render("demo", { user });
  // ctx.response.body = ``
};
let fn_home_query = async (ctx, next) => {
  let { p, s, q } = ctx.request.body;
  let pageNumber = +p || PAGENUMBER;
  let pagesize = +s || PAGESIZE;
  let result = await User.findAndCountAll({
    offset: (pageNumber - 1) * pagesize,
    attributes: { exclude: ['createdAt','updatedAt','version'] },
    limit: pagesize,
    where: {
      [Op.or]: [{ email: { [Op.like]: `%${q}%` } }, { name: { [Op.like]: `%${q}%` } }]
    }
  });
  let { count, rows } = result;
  ctx.response.body = { p: p + 1, s, rows, count };
};
let fn_home_add =async(ctx, next)=>{
  let { email, name, tel,gender} = ctx.request.body;
  let result = await User.create({email,name,tel,gender:+gender})
  console.log(result)
  ctx.response.body=result
}
let fn_home_edit =async(ctx, next)=>{
  let { email, name, tel,gender,id } = ctx.request.body;
  let result = await User.update({email,name,tel,gender:+gender,id:+id}, {where: {id:+id}})
  switch (result[0]) {
    case 0:
      console.log(id+':提交成功，没有数据变更')
      break;
    case 1:
      console.log(id+':提交成功，有变更数据')
      break;
    default:
      break;
  }
  ctx.response.body=result
}
let fn_home_delete =async(ctx, next)=>{
  let { id } = ctx.request.body;
  let result = await User.destroy({where: {id:+id}})
  // switch (result[0]) {
  //   case 0:
  //     console.log(id+':提交成功，没有数据变更')
  //     break;
  //   case 1:
  //     console.log(id+':提交成功，有变更数据')
  //     break;
  //   default:
  //     break;
  // }
  ctx.response.body=result===1?'success':'fail'
}

module.exports = {
  "GET /": fn_home,
  "POST /": fn_home_query,
  "PUT /add": fn_home_add,
  "PUT /edit": fn_home_edit,
  "DELETE /delete": fn_home_delete,
};
