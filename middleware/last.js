module.exports = async function(ctx, next) {
  await next();
  ctx.response.type = "text/html";
};
