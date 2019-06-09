const fs = require("fs");
const path = require("path");
/**
 * 检查文件夹是否存在，不存在就创建
 * @param {*} p
 */
function checkDirExist(p) {
  if (!fs.existsSync(p)) {
    fs.mkdirSync(p);
  }
}
global.PAGESIZE = 10;
global.PAGENUMBER = 1;

global.STATICROOTDIR='public';//对内目录
global.STATICROOTPATH='/static';//对外目录
checkDirExist(path.resolve(STATICROOTDIR))

global.UPLOADPATH=path.resolve(`${STATICROOTDIR}/upload`);
global.UPLOADPATH2=`/${STATICROOTDIR}/upload/`;
checkDirExist(UPLOADPATH)

