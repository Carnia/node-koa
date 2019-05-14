module.exports = async function(ctx, next) {
  console.log(`-------receive：${ctx.request.method} ${ctx.request.url}`);
  await next();
};
