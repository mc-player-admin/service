# 如何贡献

## 克隆仓库

```shell
git clone https://github.com/mc-player-admin/service
```

## 安装模块并启动

```shell
yarn install
yarn dev
```

## 开始开发

// ...

## 代码规范

- ...

## 模块划分

- 用户模块 User
- 审核模块 Audit
- 工单模块 Issues
- 文档模块 Docs

## 提交规范

[commitlint](https://github.com/conventional-changelog/commitlint/#what-is-commitlint)

```
type(scope?): subject
```

- type:

  - build 打包
  - ci CI 部署
  - docs 修改文档
  - feat 增加新功能
  - fix 修复 bug
  - perf 性能优化
  - refactor 功能/代码重构
  - revert 版本回退
  - style 样式修改不影响逻辑
  - test 增删测试
  - chore 构建过程或辅助工具的变动

- scope: 修改范围
- subject: 提交内容

此外，还提供了`yarn cz`来调用 git-cz 进行问答式提交
