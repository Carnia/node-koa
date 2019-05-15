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
    limit: pagesize,
    where: {
      [Op.or]: [{ email: { [Op.like]: `%${q}%` } }, { name: q }]
    }
  });
  let { count, rows } = result;
  ctx.response.body = { p: p + 1, s, rows, count };
};
module.exports = {
  "GET /": fn_home,
  "POST /": fn_home_query
};
