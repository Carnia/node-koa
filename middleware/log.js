module.exports = async function(ctx, next) {
  let dateNow=new Date().toLocaleString()
  console.log(`【${dateNow}】-------receive：${ctx.request.method} ${ctx.request.url}`);
  try {
    await next();
  } catch (error) {
    console.error(`${dateNow} ${error}`)
  }
};
