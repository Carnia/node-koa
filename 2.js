var fs = require('fs');
let data=fs.readFile('1.js','utf-8',(err,data)=>{
  if(err){
    console.log(err)
  }else{
    console.log(data)
  }
})
let a=require('./1')
console.log('module 2')
a()