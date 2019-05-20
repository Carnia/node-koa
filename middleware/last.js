module.exports = async function(ctx, next) {
  ctx.response.type = "text/html";
  await next();
};
