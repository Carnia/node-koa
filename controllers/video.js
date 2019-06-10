
let video_list=async (ctx,next)=>{
  await ctx.render("video",{pageName:'six-four'});
}
module.exports = {
  'GET /video/64':video_list
}