
let video_list=async (ctx,next)=>{
  await ctx.render("video",{pageName:'something'});
}
module.exports = {
  'GET /video/st':video_list
}