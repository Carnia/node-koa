module.exports = async (ctx,next)=>{
  try {
    await next()
  } catch (error) {
    if(error.status===404){
      ctx.body=`
        没有这个页面 0.o
      `
    }
    console.log(error)
  }
}