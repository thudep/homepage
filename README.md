# homepage

## 文件结构

`content` 中为所有内容文件, 日常维护时只需要修改此文件夹中的文件, 其中:
- `index` 文件夹存储主页面的信息.
  - [`show.csv`](./content/index/show.csv) 中记录轮播图中的展示数据.
    - `type` 列分为 `wechat` 与 `content` 两种情况, 其中 `wechat` 表示页面来源为微信公众号, `content` 则表示其它页面.
    - `url` 列为链接.
    - `title` 列为标题, 若为微信公众号文章, 不填写时会自动获取.
    - `img` 列为展示的图片相对于 `content` 文件夹的路径, 若为微信公众号文章, 不填写时会自动获取封面图.
- `members` 文件夹存储"成员"页面的信息.
  - [`banner.jpg`](./content/members/banner.jpg) 为"成员"页面顶部展示的图片.
  - [`members.csv`](./content/members/members.csv) 中记录科协成员的信息.
    - `姓名` 列为必填项, `班级`、`邮箱`、`GitHub账号` 会根据填写情况在各人页面显示.
    - `届1` 至 `职务5` 列依次为 5 组在科协的任职信息, 若有对应的任职情况, 则 `届` 必填, `部门` 除科协主席外必填, `职务` 只需主席与副主席填写.
    - `工作1` 至 `工作10` 列依次为参与工作信息(如有需要可继续添加列), 记录主要参加的工作, 不记录日常工作, 赛事工作情况请详细记录, 赛事名称与届数需按格式严格填写.
- `events` 文件夹存储"赛事"页面的信息.
  - [`banner.jpg`](./content/events/banner.jpg) 为"赛事"页面顶部展示的图片.
  - [`ohters.csv`](./content/events/others.csv) 作为 [`members.csv`](./content/members/members.csv) 的补充, 用于完善赛事组委会信息.
    - `身份` 列分为 `教师` 与 `学生` 两种情况, 其中 `教师` 会在组委会成员统计时被认定为指导教师.
    - `姓名` 列为必填项, 如果同一姓名在 [`members.csv`](./content/members/members.csv) 中同届同赛事中已有记录, 则不会重复记录.
    - `赛事` 与 `届数` 列需按格式严格填写, `赛事` 填准确完整的名称, `届数` 为阿拉伯数字.
  - `markdown` 文件夹存储各赛事的文档, 需注意 markdown 文件仅第一行可出现一级标题, 且内容需为赛事全名.
  - `cover_img` 文件夹存储各赛事展示卡片的封面图, 封面图与对应的 `.md` 文件除后缀外文件名称应完全相同.
- `publicity` 文件夹存储"宣传"页面的信息.
  - [`banner.jpg`](./content/publicity/banner.jpg) 为"宣传"页面顶部展示的图片.
  - [`publicity.csv`](./content/publicity/publicity.csv) 中记录"宣传"页面展示的微信公众号推文链接, 仅 `url` 一列.
- `logs` 文件夹存储"日志"页面的 `mdbook` 文件.
  - `src` 文件夹存储所有的 markdown 文件, 在内部用年份为名建立每年的文件夹, 进一步用月份为名建立每月的 markdown 文件.

`website` 中存储网页的 `.html`、`.css`、`.js` 文件以及补全网页内容所用的 `Makefile` 与 `.py` 脚本等, 没有新加功能或显示调整时不修要修改该文件夹中的文件.

所有以 `test` 为首的文件夹与文件均不会被 `git` 追踪, 可作本地调试使用.

## Makefile

在根目录的 [`Makefile`](./Makefile) 文件中, 有如下常用的核心功能:
- 补全网页文件.
```bash
make all
```
- 重新补全网页文件, 已经通过脚本的生成的页面会被重新生成一遍.
```bash
make remake
```
- 启用本地服务器展示网页(会预先调用 `make all` 自动补全).
```bash
make serve
```
