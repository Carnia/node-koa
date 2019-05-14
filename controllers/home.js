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
  ctx.response.body = `
    <h1>hello</h1>
    <div>${JSON.stringify(user)}</div>
    <input type=text id=input1 placeholder=搜索email或者姓名 />
    <button id=btn>ajax</button>
    <div id=result></div>
    <script>
    let input1=document.querySelector('#input1')
    let btn=document.querySelector('#btn')
    let result=document.querySelector('#result')
    btn.onclick=()=>{
        let data={
          q:input1.value,
          p:1,
          s:10
        }
        fetch('/', {
          method: 'POST', // or 'PUT'
          body: JSON.stringify(data), // data can be string or {object}!
          headers: new Headers({
            'Content-Type': 'application/json'
          })
        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => {console.log(JSON.stringify(response));result.innerHTML=JSON.stringify(response)});
      }
    </script>
  `;
};
let fn_home_query = async (ctx, next) => {
  let { p, s, q } = ctx.request.body;
  let pageNumber = +p || PAGENUMBER;
  let pagesize = +s || PAGESIZE;
  let result = await User.findAndCountAll({
    offset: (pageNumber - 1) * pagesize,
    limit: pagesize,
    where: {
      [Op.or]: [{ email: q }, { name: q }]
    }
  });
  let { count, rows } = result;
  ctx.response.body = { p: p + 1, s, rows, count };
};
module.exports = {
  "GET /": fn_home,
  "POST /": fn_home_query
};
