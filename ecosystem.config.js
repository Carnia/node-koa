let logTime = new Date().toLocaleDateString()
let testConfig= require('./config/test')
console.log(`load ecosystem.config.js`,logTime)
module.exports = {
  apps: [
    {
      //当只想启动当前项目时，使用pm2 start *.config.js --only APP【这个APP就是项目名】
      name: 'APP', //给当前项目取名 
      script: 'app.js',
      cwd: "./", // 根目录
      // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
      args: 'one two',// 传参给process.env.args
      instances: 1,//启动实例个数
      autorestart: false,// 启动失败是否自动重启，过多次数会自动停止
      watch: true,// 监测文件改变自动重启
      // "watch": [ "bin", "routers" ], // 指定检测路径
      "ignore_watch": [
        "node_modules",
        "logs",
        "public"
      ],
      "watch_options": {
        "followSymlinks": false
      },
      "error_file": `./logs/${logTime}/err.log`,  //日志存放目录
      "out_file": `./logs/${logTime}/app.log`,
      max_memory_restart: '1G',// 超出内存限制就重启
      // 使用环境指令 pm2 start *.config.js --env test
      // 所有的环境参数都能通过process.env[keyName]拿到，但是必须是字符串
      env: {
        "NODE_ENV": "production",
        "DB": JSON.stringify(testConfig.db),
        //传递对象->在需要使用的地方直接parse一下就行： const config = JSON.parse(process.env.DB);
        "PORT":"9000",
      },
      env_dev: {
        "NODE_ENV": "development",
        "DB": JSON.stringify(testConfig.db),
        "PORT":"9000",
      },
      env_test: {
        "NODE_ENV": "test",
        "DB":JSON.stringify(testConfig.db),
        "PORT":"9000",
      }
    }
  ],
  deploy: {
    production: {
      user: 'node',
      host: '212.83.163.1',
      ref: 'origin/master',
      repo: 'git@github.com:repo.git',
      path: '/var/www/production',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
    }
  }
};
