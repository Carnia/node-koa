// 已经上传到npm，插件名koa-static-match-path
// https://github.com/Carnia/koa-static-match-path

const fs = require("fs");
const path = require("path");
const mimes = {
  'css': 'text/css',
  'less': 'text/css',
  'gif': 'image/gif',
  'html': 'text/html',
  'ico': 'image/x-icon',
  'jpeg': 'image/jpeg',
  'jpg': 'image/jpeg',
  'js': 'text/javascript',
  'json': 'application/json',
  'pdf': 'application/pdf',
  'png': 'image/png',
  'svg': 'image/svg+xml',
  'swf': 'application/x-shockwave-flash',
  'tiff': 'image/tiff',
  'txt': 'text/plain',
  'wav': 'audio/x-wav',
  'wma': 'audio/x-ms-wma',
  'wmv': 'video/x-ms-wmv',
  'mp4': 'video/mp4',
  'xml': 'text/xml'
}
// 解析资源类型
function parseMime(url) {
  let extName = path.extname(url);
  extName = extName ? extName.slice(1) : "unknown";
  return mimes[extName];
}

/**
 * 中间件：
 * 将静态资源映射到指定路由
 * @param {*} customizePath 本地资源所在绝对路径
 * @param {string} [customizeStaticPath="static"] 路由名
 * @returns
 */
function handleStatic(customizePath, customizeStaticPath = "static") {
  async function _handleStatic(ctx, next) {
    let autoClose = true;
    let ctxUrl = ctx.url;
    let target;
    if (customizeStaticPath.forEach) {
      for (let i = 0; i < customizeStaticPath.length; i++) {
        const temp = "/" + customizeStaticPath[i];
        if (ctxUrl.indexOf(temp) === 0) {
          autoClose = false;
          target = temp;
          break;
        }
      }
    } else if (ctxUrl.indexOf("/" + customizeStaticPath) === 0) {
      target = customizeStaticPath;
      autoClose = false;
    } else {
      next();
      return;
    }
    if (autoClose) {
      next();
      return;
    }
    let realPath = path.join(customizePath, ctxUrl.replace(new RegExp(`${target}[\/]?`), ""));

    // 静态资源目录在本地的绝对路径
    // 获取静态资源内容，有可能是文件内容，目录，或404
    ctx.body = await content(realPath, ctxUrl);

    // 解析请求内容的类型
    let _mime = parseMime(ctxUrl);

    // 如果有对应的文件类型，就配置上下文的类型
    if (_mime) {
      ctx.type = _mime;
    }
    next();
  }
  return _handleStatic;
}

/**
 * 遍历读取目录内容方法
 * @param {*} reqPath
 * @returns
 */
function traversing(reqPath) {

  let files = fs.readdirSync(reqPath);

  let dirList = [],
    fileList = [];
  for (let i = 0, len = files.length; i < len; i++) {
    let item = files[i];
    let itemArr = item.split("\.");
    let itemMime = (itemArr.length > 1) ? itemArr[itemArr.length - 1] : "undefined";

    if (typeof mimes[itemMime] === "undefined") {
      dirList.push(files[i]);
    } else {
      fileList.push(files[i]);
    }
  }


  let result = dirList.concat(fileList);

  return result;
};

/**
 * 渲染目录内容方法
 * @param {*} reqPath
 * @param {*} url 
 * @returns
 */
function dir(reqPath, url) {
  if (url.endsWith("/")) {
    url = url.slice(0, -1);
  }
  // 遍历读取当前目录下的文件、子目录
  let contentList = traversing(reqPath);
  let html = `<ul>`;
  for (let [index, item] of contentList.entries()) {
    html = `${html}<li><a href="${url === "/" ? "" : url}/${item}">${item}</a></li>`;
  }
  html = `${html}</ul>`;

  return html;
}

/**
 * 获取静态资源内容
 * @param {*} reqPath
 * @param {*} url
 * @returns
 */
async function content(reqPath, url) {
  // 判断请求路径是否为存在目录或者文件
  let exist = fs.existsSync(reqPath);

  // 返回请求内容， 默认为空
  let content = "";

  if (!exist) {
    //如果请求路径不存在，返回404
    content = "404 Not Found! o(╯□╰)o！";
  } else {
    //判断访问地址是文件夹还是文件
    let stat = fs.statSync(reqPath);

    if (stat.isDirectory()) {
      //如果为目录，则渲读取目录内容
      content = dir(reqPath, url);
    } else {
      // 如果请求为文件，则读取文件内容
      content = fs.readFileSync(reqPath);
    }
  }

  return content;
}
module.exports = handleStatic;