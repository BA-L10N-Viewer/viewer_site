<template>
  <h1>免责声明 / Disclaimer</h1>
  <p>本站与<span lang="ja">ブルーアーカイブ</span>（<span lang="en">Blue Archive</span>、<span lang="zh_CN">蔚蓝档案</span>）、Yostar、Nexon与Nexon Games没有任何形式关联。</p>
  <p>本网站中使用的所有游戏作品、信息和素材均为各自作者的财产与版权。</p>
  <p>本站仅做数据展示功能。本站无任何盈利。</p>
  <p>This site is not affilicated in any forms with Blue Archive, Yostar, Nexon and Nexon Games.</p>
  <p>All game artwork, information and assets used in this site are the property of their respective authors, who also own the copyrights of their respective parts.</p>
  <p>This site is sorely for data display purpose and has no monetization over it.</p>
  
  <hr />

  <h1>本地化，重中之重</h1>
  <p>好的本地化无关特权：这是基本要求。</p>

  <h2>使用的技术</h2>
  <p>本站分为前、后端两个部分，其分别使用了：</p>
  <ul>
    <li><a href="https://vuejs.org/">Vue 3</a>，用作开发框架</li>
    <li><a href="https://vitepress.dev/">VitePress</a>，用于静态页面生成</li>
    <li><a href="https://primevue.org/">PrimeVue</a>，提供UI组件库</li>
    <li><a href="https://python.org/">Python</a>，用于对数据的预处理</li>
  </ul>
  <p>并同时使用了以下工具或服务：</p>
  <ul>
    <li><a href="https://pages.github.com/">GitHub Pages</a>，用于网站内容托管</li>
    <li><a href="https://actions.github.com/">GitHub Actions</a>，用于自动化与CI/CD流程</li>
    <li><a href="https://cloudflare.com/">CloudFlare</a>， 用于主站CDN加速</li>
    <li><a href="https://aws.amazon.com/cloudfront/">CloudFront</a>，用于对中国大陆地区加速</li>
    <li><a href="https://developers.google.com/analytics/">Google Analytics</a>， 用于匿名访问数据收集</li>
    <li><a href="https://clarity.microsoft.com/">Microsoft Clarity</a>，用于访问行为分析</li>
  </ul>
  
  <h2>数据源</h2>
  <p>部分来自<a href="https://schaledb.com/">SchaleDB</a>。</p>
  <DataVersionDisplay :verbose="true" />
  
  <h2>联系我们</h2>
  <p>GitHub：<a href="https://github.com/BA-L10N-Viewer/">项目主页</a>、<a href="https://github.com/BA-L10N-Viewer/viewer_site/">站点Repo</a>、<a href="https://github.com/orgs/BA-L10N-Viewer/discussions/">讨论版</a></p>
  <p>主要开发者（@sctop）：<a href="https://github.com/sctop/">GitHub</a>、<a href="https://twitter.com/KitePythonner">Twitter/X（@KitePythonner）</a>、<a href="https://space.bilibili.com/93650528/">B站（@童年是个风筝）</a></p>

  <h2>致谢</h2>
  <p>本网站部分受<a href="https://nikke.win/">NIKKE.WIN</a>启发而开发。</p>
</template>

<script setup lang="ts">
import DataVersionDisplay from '@/components/DataVersionDisplay.vue'
</script>