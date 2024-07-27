<template>
  <h1 class="view-h1">关于本网站</h1>
  <h2>使用的技术</h2>
  <p>本网站的开发可分为<b>前端</b>和<b>后端</b>两部分，各部分使用了不同的编程语言及框架。</p>
  <p><b>后端部分</b>使用了<a href="https://python.org">Python</a>，对原始数据（由第三方提供）进行预处理以便供网站显示。</p>
  <p><b>前端部分</b>使用了<a href="https://vuejs.org/">Vue.JS</a>作为网站框架，<a href="https://vitepress.dev/">VitePress</a>用于生成静态网页。</p>
  <p>本站使用<a href="https://pages.cloudflare.com/">CloudFlare Pages</a>进行数据<b>托管</b>，并使用<a href="https://aws.amazon.com/cloudfront/">AWS CloudFront</a>进行<b>CDN加速</b>。</p>
  <p>本站使用<a href="https://marketingplatform.google.com/about/analytics/">Google Analytics</a>与<a href="https://clarity.microsoft.com/">Microsoft Clarity</a>进行用户访问数据收集，以便更好改善体验并调试问题。</p>
  <h2>使用的数据</h2>
  <p>部分人物信息来自<a href="https://schale.gg/">SchaleDB</a>。</p>
  <p>故事信息来自第三方提供的游戏内数据，所有这些数据均属于其各自的权利人及著作者。</p>
  <h1 class="view-h1">免责声明</h1>
  <p>本站为<b>非盈利性质</b>的<b>粉丝向</b>网站，所用数据均为<b>可公开访问</b>、已经存在于《蔚蓝档案》游戏中的内容。</p>
  <p><b>本站与游戏本身、NEXON Games、Yostar均无任何关系。</b></p>
  <p>本站所有数据均属于其各自的权利人及著作者。本站仅做数据显示功能。</p>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
<script setup lang="ts">
</script>