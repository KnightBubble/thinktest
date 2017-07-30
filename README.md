
## tips
- npm install thinkjs@2 -g
- thinkjs module xxx，即可创建名为 xxx 的模块。
- thinkjs model home/user 创建模型：

Application created by [ThinkJS](http://www.thinkjs.org)

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