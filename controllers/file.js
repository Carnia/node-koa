const fileSys=require('../utils/fileSys.js')

let fn_file = async (ctx, next) => {
  await ctx.render("file");
};
let fn_upload = async (ctx, next) => {
  // 上传单个文件
  const file = ctx.request.files.file; // 获取上传文件
  fileSys.handleFileUpload(ctx)
  ctx.body=file.path
};
let fn_uploadFiles = async (ctx, next) => {
  // 上传多个文件
  const files = ctx.request.files.file; // 获取上传文件
  await fileSys.handleFileUpload(ctx)
  ctx.body=JSON.stringify(files.map((f)=>f.path))
};

module.exports = {
  "GET /file": fn_file,
  "POST /uploadFile": fn_upload,
  "POST /uploadFiles": fn_uploadFiles
};
