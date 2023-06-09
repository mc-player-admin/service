# mc 玩家管理系统

[前端仓库](https://github.com/mc-player-admin/web)  
正在开发中

# 提交规范

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
