
### 脚本钩子机制

- `package.json`支持定义**生命周期脚本**，这些脚本会在特定的 npm/Yarn 命令执行前后自动触发
- **常见钩子**：`preinstall`、`install`、`postinstall`、`prepublish`、`prepare`等

**postinstall 的触发场景**

|**命令**|**是否触发 postinstall**|**说明**|
|---|---|---|
|`npm install`|✅|安装项目依赖时|
|`npm install package`|✅|安装单个包时|
|`npm ci`|✅|持续集成环境中安装依赖（更严格）|
|`yarn install`|✅|Yarn 安装依赖时|
|`npm run install`|❌|手动执行`install`脚本时（不会触发生命周期钩子）|

**典型应用场景**
* 自动编译TS代码
* 创建配置文件、生成密钥或初始化数据库
* 集成第三方工具：自动配置 Husky Git 钩子

