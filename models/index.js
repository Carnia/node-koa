const fs = require("fs");
const db = require("../db");
function log() {
  console.log("【models】", ...arguments);
}
let files = fs.readdirSync(__dirname);
// let files = fs.readdirSync(__dirname + '/models');

let js_files = files.filter(f => {
  return f.endsWith(".js") && !f.includes("index");
}, files);
let models = {
  sync: db.sync,
  Op: db.Op
};
for (let f of js_files) {
  log(`import model from file ${f}...`);
  let name = f.substring(0, f.length - 3);
  // module.exports[name] = require(__dirname + '/models/' + f);
  models[name] = require(__dirname + "/" + f);
}
module.exports = models;
