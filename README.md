# 师学通 Web 版

React + Vite 单页应用，与微信小程序共享 CloudBase 后端。

## 快速开始

```bash
# 安装 Node.js (https://nodejs.org/) 后执行:
npm install
npm run dev
```

浏览器自动打开 `http://localhost:3000`。

## 技术栈

- **React 18** + React Router 6 (Hash 路由)
- **Vite 5** 极速构建
- **@cloudbase/js-sdk** 腾讯云开发 Web SDK
- 移动端优先，最大宽度 430px

## 页面结构

| 路由 | 页面 | 对应小程序 |
|------|------|-----------|
| `/` | 首页 | pages/index |
| `/courses` | 专题课堂 | packageCourse/course-list |
| `/openmaic` | AI 互动课堂 | packageMAIC/classroom-list |
| `/ai-chat` | AI 助手 | packageAI/chat |
| `/profile` | 个人中心 | pages/profile |
| `/news` | 校园资讯 | packageProfile/my-notes |
| `/news/:id` | 资讯详情 | packageProfile/news-detail |
| `/activities` | 活动报名 | packageProfile/certificate-center |
| `/activities/:id` | 活动详情 | packageProfile/activity-detail |

## CloudBase 环境

环境 ID: `cloud1-7gku4v6nd4264b1d`

需在 [CloudBase 控制台](https://console.cloud.tencent.com/tcb) 的 **安全配置 → Web安全域名** 中添加你的域名。
