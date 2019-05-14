let fn_login = async (ctx, next) => {
  let user = ctx.request.body.user;
  pwd = ctx.request.body.pwd;
  ctx.response.body = {
    a: "ok",
    user,
    pwd
  };
};
module.exports = {
  "POST /login": fn_login
};
