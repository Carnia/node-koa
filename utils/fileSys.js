const fs = require("fs");
const path = require("path");
const model = require("../models/index.js");

/**
 * 根据日期生成存放目录
 * @returns
 */
function getUploadDirName() {
  const date = new Date();
  let month = Number.parseInt(date.getMonth()) + 1;
  month = month.toString().length > 1 ? month : `0${month}`;
  const dir = `${date.getFullYear()}${month}${date.getDate()}`;
  return dir;
}

/**
 * 检查文件夹是否存在，不存在就创建
 * @param {*} p
 */
function checkDirExist(p) {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p);
  }
}

/**
 * 获取文件后缀
 * @param {*} name
 * @returns
 */
function getUploadFileExt(name) {
  let ext = name.split(".");
  return ext[ext.length - 1];
}

/**
 * 生成时间戳文件名
 * @param {*} ext
 * @returns
 */
function getUploadFileName(ext) {
  return new Date().getTime() + "." + ext;
}


/**
 * 接收文件对象，并存入数据库和本地
 * @param {*} file
 * @param {boolean} [keepName=false]
 */
async function creatFile(file, keepName = false) {
  return new Promise((resolve,reject)=>{
    const tempPath = file.path;
    // 创建可读流
    const reader = fs.createReadStream(file.path);
    let loaded = 0,
      size = file.size;
    //进度监听
    reader.on("data", chunk => {
      loaded += chunk.length;
      loaded === size&&console.log(`接受文件：(${file.name})：${((loaded / size) * 100).toFixed(2)}%`);
    });
    //存入数据库
    reader.on("end", async () => {
      let result = await model.File.create({
        file: fs.readFileSync(path.join(__dirname, "../" + tempPath)),
        localPath: file.path,
        name: file.name,
        size: size
      });
      // console.log(`存储完毕：(${file.name})：数据库id：${ result.id}, 本地路径: ${file.path.split('public').pop()}`);
      console.log(`存储完毕：(${file.name})：数据库id：${ result.id}, 本地路径: ${file.path}, 显示路径: ${file.outPutPath}`);
      // 删除临时文件
      fs.unlinkSync(tempPath);
      resolve()
    });
    // 获取文件后缀
    const ext = getUploadFileExt(file.name);
    // 最终要保存到的文件夹目录
    // const dir0 = path.join(__dirname, `../public/upload/${getUploadDirName()}`);
    const dirName=getUploadDirName()
    const fileName=keepName ? file.name : getUploadFileName(ext)
    const dir = path.join(UPLOADPATH, dirName);
    // 检查文件夹是否存在如果不存在则新建文件夹
    checkDirExist(dir);
    // 重新覆盖 file.path 属性
    file.outPutPath = `${UPLOADPATH2.replace(STATICROOTDIR,STATICROOTPATH.slice(1))}${dirName}/${fileName}`;
    file.path = `${dir}/${fileName}`;
    // 创建可写流
    const upStream = fs.createWriteStream(file.path);
    // 可读流通过管道写入可写流
    reader.pipe(upStream);
  })
}


/**
 * 根据请求头分别处理 单文件上传 和 多文件上传
 * @param {*} ctx
 */
async function handleFileUpload(ctx) {
  const keepName = ctx.request.body.keepName === "true";
  const files = ctx.request.files.file;
  const fileType = Object.prototype.toString.call(files).slice(8, -1);
  switch (fileType) {
    case "Array":
      files.forEach( async file => {
        await creatFile(file, keepName);
      });
      break;
    case "Object":
      await creatFile(files, keepName);
      break;
    default:
      break;
  }
}
module.exports = {
  handleFileUpload
};
