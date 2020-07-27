## 源代码目录
build	vue编译目录
config		vue编译配置
default.conf	缺省配置
dist		发布
package.json	依赖包配置
src		源代码
└─── App.vue	主程序
└─── assets	资源文件
└─── components	组件
└─── http.js	http配置
└─── main.js	入口
└─── router	路由
└─── util	工具
static		静态文件目录

## 服务器信息
[服务器文档](http://106.13.100.42/root/China/wikis/%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83%E6%9C%8D%E5%8A%A1%E5%99%A8%E8%B5%84%E6%BA%90?nsukey=Cd0Rco2J3hZBP%2ByWFJyAnuMw2uF7Hl3XC8uCOCRIHd93%2FtPT6t1gvlgOpRrR64aoTcRAc8sem6U52IqSz7nof5D1Gl%2BafIIDyYB34dZ5cjPrYeQ2kRKoj7jrA87qCZd9%2F6Sr2WB%2BaplYOP1EKEnLHCnZitmTXJ8yqxUCXVAd9LM9%2BehGlp2ILZc1DjzxRma7gRc366Pr4r8Do39iJFI6ag%3D%3D)
使用的“8u32G应用服务器-0003”

用户 **www**

## 部署
1. clone 代码到 /data/project/lishiyanjiuyuan-app-admin
`git clone http://106.13.100.42/root/lsbwg-gzh-houtai.git /data/project/sbwg-gzh-houtai`
2. 安装依赖 & 构建
`npm install && npm run build`
构建成功会生成的 dist 目录
3. 修改nginx配置。/etc/nginx/nginx.conf 80端口的配置
    1. 修改 root 指向生成的dist目录 `root  /data/project/sbwg-gzh-houtai/dist;`
    2. 修改 后端 api rewrite 规则

    ```
       location /apis/ {
           proxy_pass    http://replace-with-server-addr/;
       }

       location /images/ {
           proxy_pass    http://replace-with-server-addr/;
       }
    ```
4. `nginx -s reload`

