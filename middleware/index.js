const fs = require("fs");
const db = require("../db");
function log() {
  console.log("【middleware】", ...arguments);
}
let middleware = {};
let files = fs.readdirSync(__dirname);
files.forEach(f => {
  if (f.endsWith(".js") && !f.includes("index")) {
    log(`import middleware from file ${f}...`);
    let name = f.substring(0, f.length - 3);
    middleware[name] = require(__dirname + "/" + f);
  }
});
module.exports = middleware;
