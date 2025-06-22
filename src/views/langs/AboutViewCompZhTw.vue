<template>
  <h1>免責宣告 / Disclaimer</h1>
  <p>
    本站與<span lang="ja">ブルーアーカイブ</span>（<span lang="en">Blue Archive</span>、<span
      lang="zh_CN"
      >蔚藍檔案</span
    >）、Yostar、Nexon與Nexon Games沒有任何形式關聯。
  </p>
  <p>本網站中使用的所有遊戲作品、資訊和素材均為各自作者的財產與版權。</p>
  <p>本站僅做資料展示功能。本站無任何盈利。</p>
  <p>This site is not affilicated in any forms with Blue Archive, Yostar, Nexon and Nexon Games.</p>
  <p>
    All game artwork, information and assets used in this site are the property of their respective
    authors, who also own the copyrights of their respective parts.
  </p>
  <p>This site is sorely for data display purpose and has no monetization over it.</p>

  <hr />

  <h1>本地化，重中之重</h1>
  <p>好的本地化無關特權：這是基本要求。</p>

  <h2>使用的技術</h2>
  <p>本站分為前、後端兩個部分，其分別使用了：</p>
  <ul class="ul-compact">
    <li><a href="https://vuejs.org/">Vue 3</a>，用作開發框架</li>
    <li><a href="https://vitepress.dev/">VitePress</a>，用於靜態頁面生成</li>
    <li><a href="https://primevue.org/">PrimeVue</a>，提供UI元件庫</li>
    <li><a href="https://python.org/">Python</a>，用於對資料的預處理</li>
  </ul>
  <p>並同時使用了以下工具或服務：</p>
  <ul class="ul-compact">
    <li><a href="https://pages.github.com/">GitHub Pages</a>，用于网站内容托管</li>
    <li><a href="https://actions.github.com/">GitHub Actions</a>，用于自动化与CI/CD流程</li>
    <li><a href="https://cloudflare.com/">CloudFlare</a>， 用於主站CDN加速</li>
    <li><a href="https://aws.amazon.com/cloudfront/">CloudFront</a>，用於對中國大陸地區加速</li>
    <li>
      <a href="https://developers.google.com/analytics/">Google Analytics</a>，用於匿名訪問資料收集
    </li>
    <li><a href="https://clarity.microsoft.com/">Microsoft Clarity</a>，用於訪問行為分析</li>
  </ul>

  <h2>資料來源</h2>
  <p>部分來自<a href="https://schaledb.com/">SchaleDB</a>。</p>
  <DataVersionDisplay :verbose="true" />

  <h2>聯絡我們</h2>
  <p>
    GitHub：<a href="https://github.com/BA-L10N-Viewer/">專案主頁</a>、<a
      href="https://github.com/BA-L10N-Viewer/viewer_site/"
      >站點Repo</a
    >、<a href="https://github.com/orgs/BA-L10N-Viewer/discussions/">討論版</a>
  </p>
  <p>
    主要開發者（@sctop）：<a href="https://github.com/sctop/">GitHub</a>、<a
      href="https://twitter.com/KitePythonner"
      >Twitter/X（@KitePythonner）</a
    >、<a href="https://space.bilibili.com/93650528/">B站（@童年是个风筝）</a>
  </p>

  <h2>致謝</h2>
  <p>本網站部分受<a href="https://nikke.win/">NIKKE.WIN</a>啟發而開發。</p>
</template>

<script setup lang="ts">
import DataVersionDisplay from '@/components/DataVersionDisplay.vue'
</script>
