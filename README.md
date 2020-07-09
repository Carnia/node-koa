# a koa demo

## mysql
mysql需要初始化
服务器装好mysql服务后，要用`mysql_secure_installation`配置,在配置过程中，设置mysql的用户：root，密码为123(因为node-koa中初始化用的就是这个账户)。
```bash
  #1
  VALIDATE PASSWORD PLUGIN can be used to test passwords...
  Press y|Y for Yes, any other key for No: N (我的选项)

  #2
  Please set the password for root here...
  New password: (输入密码)
  Re-enter new password: (重复输入)

  #3
  By default, a MySQL installation has an anonymous user,
  allowing anyone to log into MySQL without having to have
  a user account created for them...
  Remove anonymous users? (Press y|Y for Yes, any other key for No) : N (我的选项)

  #4
  Normally, root should only be allowed to connect from
  'localhost'. This ensures that someone cannot guess at
  the root password from the network...
  Disallow root login remotely? (Press y|Y for Yes, any other key for No) : Y (我的选项)

  #5
  By default, MySQL comes with a database named 'test' that
  anyone can access...
  Remove test database and access to it? (Press y|Y for Yes, any other key for No) : N (我的选项)

  #6
  Reloading the privilege tables will ensure that all changes
  made so far will take effect immediately.
  Reload privilege tables now? (Press y|Y for Yes, any other key for No) : Y (我的选项)
  
  原文链接：https://blog.csdn.net/weixx3/java/article/details/80782479
```
  
#### 如果mysql连数据库的时候报错:

```
1251 client does not support authentication protocol requested by server;consider upgrading Mysql client

ERROR 1396 (HY000): Operation ALTER USER failed for 'root'@'localhost'

先登录mysql

mysql -u root -p
输入密码 一般是没有密码

执行：
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '123';
链接：https://www.geekjc.com/post/5cbe76ce066d3d3ce5c12fd0
```


### 最后手动创建table1这个表`create database table1`。

## nginx配置

```bash
server {
        listen 80;
        listen [::]:80;

        #这里要配置域名
        server_name somewebsite.com;

        index index.html;
        location / {
                # 这个是为了接口调用
                proxy_pass http://127.0.0.1:9000/;
        }
        location /koa/ {
                # 这个是为了页面访问。项目配置的就是/koa/这个路径
                proxy_pass http://127.0.0.1:9000/;
        }
}
```

## 开始
需要全局安装pm2，`npm i -g pm2`
第一次执行需要把app.js中的`await model.sync({force:true})`打开，把`await model.sync()`注释掉。
如:
```js
// await model.sync();
await model.sync({force:true});
```
然后用`npm start` 启动服务;
确认服务运行正常后，之后把服务删掉（`pm2 delete 0`），然后把app.js中的`await model.sync({force:true})`注释掉，把`await model.sync()`打开。
重新跑`npm start`。
done。




