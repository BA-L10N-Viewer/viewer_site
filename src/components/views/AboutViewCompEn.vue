<template>
  <h1>Disclaimer</h1>
  <p>This site is not affilicated in any forms with Blue Archive (<span lang="ja">ブルーアーカイブ</span>), Yostar, Nexon and Nexon Games.</p>
  <p>All game artwork, information and assets used in this site are the property of their respective authors, who also own the copyrights of their respective parts.</p>
  <p>This site is sorely for data display purpose and has no monetization over it.</p>
  
  <hr />

  <h1>Where <ruby>Localization<rt>L 1 0 N</rt></ruby> Matters</h1>
  <p>It's not a privilage to have good localization, it's a baseline.</p>

  <h2>Technologies</h2>
  <p>BALV is divided into frontend and backend parts, and the following tools are being used:</p>
  <ul>
    <li><a href="https://vuejs.org/">Vue 3</a> - The Development Framework</li>
    <li><a href="https://vitepress.dev/">VitePress</a> - Static Page Generator</li>
    <li><a href="https://primevue.org/">PrimeVue</a> - UI Components</li>
    <li><a href="https://python.org/">Python</a> - Data Preprocessing</li>
  </ul>
  <p>We also utilized the following services/tools: </p>
  <ul>
    <li><a href="https://pages.github.com/">GitHub Pages</a> - Main Site Content Server</li>
    <li><a href="https://actions.github.com/">GitHub Actions</a> - Automation and CI/CD Workflows</li>
    <li><a href="https://cloudflare.com/">CloudFlare</a> - CDN Provider for the Main Site</li>
    <li><a href="https://aws.amazon.com/cloudfront/">CloudFront</a> - CDN Acceleration for China Mainland</li>
    <li><a href="https://developers.google.com/analytics/">Google Analytics</a> - Access Data Analysis</li>
    <li><a href="https://clarity.microsoft.com/">Microsoft Clarity</a> - Access Behavior Analysis</li>
  </ul>
  
  <h2>Data Source</h2>
  <p>Part of them is from <a href="https://schaledb.com/">SchaleDB</a>.</p>
  <DataVersionDisplay :verbose="true" />
  
  <h2>Contact Us</h2>
  <p>GitHub：<a href="https://github.com/BA-L10N-Viewer/">Project Homepage</a>、<a href="https://github.com/BA-L10N-Viewer/viewer_site/">Repo for the Site</a>、<a href="https://github.com/orgs/BA-L10N-Viewer/discussions/">Discussions</a></p>
  <p>Main Developer (@sctop): <a href="https://github.com/sctop/">GitHub</a>, <a href="https://twitter.com/KitePythonner">Twitter/X (@KitePythonner)</a></p>

  <h2>Acknowledgements</h2>
  <p>This site is partly inspired by <a href="https://nikke.win/">NIKKE.WIN</a>.</p>
</template>

<script setup lang="ts">
import DataVersionDisplay from '@/components/DataVersionDisplay.vue'
</script>