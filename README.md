## 学习nodejs 框架练习项目
## tips
- npm install thinkjs@2 -g
- thinkjs module xxx，即可创建名为 xxx 的模块。
- thinkjs model home/user 创建模型：
- [excel](https://www.npmjs.com/package/excel-export)
Application created by [ThinkJS](http://www.thinkjs.org)
- jquery toast plugin,https://github.com/kamranahmedse/jquery-toast-plugin 

## mysql
增加新用户

   格式：grant 权限 on 数据库.* to 用户名@登录主机 identified by "密码"

   如，增加一个用户user1密码为password1，让其可以在本机上登录， 并对所有数  据库有查询、插入、修改、删除的权限。首先用以root用户连入mysql，然后键入以下命令：

   grant select,insert,update,delete on *.* to user1@localhost Identified by "password1";

如果希望该用户能够在任何机器上登陆mysql，则将localhost改为"%"。

如果你不想user1有密码，可以再打一个命令将密码去掉。

grant select,insert,update,delete on mydb.* to user1@localhost identified by "";


// 设置全局
git config --global user.name "Author Name"
git config --global user.email "Author Email"
 
// 或者设置本地项目库配置
git config user.name "Author Name"
git config user.email "Author Email"

## Install dependencies

```
npm install
```

## Start server

```
npm start
```

## Deploy with pm2

Use pm2 to deploy app on production enviroment.

```
pm2 startOrReload pm2.json
```