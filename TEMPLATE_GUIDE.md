# Vue 项目模板使用指南

## 项目结构

```
packages/
  base-user-interface/  # 基础用户界面模板
  example/              # 示例项目
  shared/               # 共享资源
  ui/                   # UI组件库
```

## 启动开发服务器

1. 安装依赖
```bash
pnpm install
```

2. 启动指定模板的开发服务器
```bash
pnpm --filter [模板名称] dev
```
例如启动base-user-interface模板：
```bash
pnpm --filter base-user-interface dev
```

3. 访问开发服务器
- 默认地址：http://localhost:5173/

## 创建新模板

1. 复制现有模板
```bash
cp -r packages/base-user-interface packages/[新模板名称]
```

2. 修改package.json中的name字段
```json
{
  "name": "@vue_model/[新模板名称]"
}
```

3. 在pnpm-workspace.yaml中添加新模板
```yaml
packages:
  - 'packages/*'
  - 'packages/[新模板名称]'
```

## 常用命令

- 安装依赖：`pnpm install`
- 启动开发服务器：`pnpm --filter [模板名称] dev`
- 构建生产版本：`pnpm --filter [模板名称] build`
- 运行单元测试：`pnpm --filter [模板名称] test`
- 运行E2E测试：`pnpm --filter [模板名称] test:e2e`
