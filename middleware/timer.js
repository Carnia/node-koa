module.exports = async function(ctx, next) {
  console.time("服务耗时");
  await next();
  console.timeEnd("服务耗时");
};
