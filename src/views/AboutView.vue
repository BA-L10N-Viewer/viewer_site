<script setup lang="ts">
import { useSetting } from '@/stores/setting'

const setting = useSetting()
</script>

<template>
  <div v-show="setting.ui_lang === 'zh_CN'">
    <h1 class="view-h1" id="disclaimer">免责声明 / Disclaimer</h1>
    <p>本站与ブルーアーカイブ、Yostar、Nexon 以及 Nexon Games 没有任何形式关联。</p>
    <p>本网站中使用的所有游戏作品、信息和素材均为各自作者的财产和版权。</p>
    <p>本站仅做数据显示功能。</p>
    <p>This site is not affiliated in any forms with Blue Archive, Yostar, Nexon and Nexon Games.</p>
    <p>All game artwork, information and assets used in this site are the property and copyright of the respective authors.</p>
    <p>This site is only for data showcase.</p>
    <h1 class="view-h1">关于本网站</h1>
    <h2>使用的技术</h2>
    <p>本网站的开发可分为<b>前端</b>和<b>后端</b>两部分，各部分使用了不同的编程语言及框架。</p>
    <p><b>后端部分</b>使用了<a href="https://python.org">Python</a>，对原始数据（由第三方提供）进行预处理以便供网站显示。</p>
    <p><b>前端部分</b>使用了<a href="https://vuejs.org/">Vue.JS</a>作为网站框架，<a href="https://vitepress.dev/">VitePress</a>用于生成静态网页。</p>
    <p>本站使用<a href="https://pages.github.com/">GitHub Pages</a>进行数据<b>托管</b>，并使用<a href="https://aws.amazon.com/cloudfront/">AWS CloudFront</a>进行<b>CDN加速</b>。</p>
    <p>本站使用<a href="https://marketingplatform.google.com/about/analytics/">Google Analytics</a>与<a href="https://clarity.microsoft.com/">Microsoft Clarity</a>进行用户访问数据收集，以便更好改善体验并调试问题。这些数据都是匿名的，除非您主动提供相关信息，否则我们无法追踪到您。</p>
    <h2>使用的数据</h2>
    <p>部分人物信息来自<a href="https://schaledb.com/">SchaleDB</a>。</p>
    <p>故事信息来自第三方提供的游戏内数据，所有这些数据均属于其各自的权利人及著作者。</p>
  </div>
  <div v-show="setting.ui_lang === 'zh_TW'">
    <h1 class="view-h1" id="disclaimer">免責宣告 / Disclaimer</h1>
    <p>本站與ブルーアーカイブ、Yostar、Nexon 以及 Nexon Games 沒有任何形式關聯。</p>
    <p>本網站中使用的所有遊戲作品、資訊和素材均為各自作者的財產和版權。</p>
    <p>本站僅做資料顯示功能。</p>
    <p>This site is not affiliated in any forms with Blue Archive, Yostar, Nexon and Nexon Games.</p>
    <p>All game artwork, information and assets used in this site are the property and copyright of the respective authors.</p>
    <p>This site is only for data showcase.</p>
    <h1 class="view-h1">關於本網站</h1>
    <h2>使用的技術</h2>
    <p>本網站的開發可分為<b>前端</b>和<b>後端</b>兩部分，各部分使用了不同的程式語言及框架。</p>
    <p><b>後端部分</b>使用了<a href="https://python.org">Python</a>，對原始資料（由第三方提供）進行預處理以便供網站顯示。</p>
    <p><b>前端部分</b>使用了<a href="https://vuejs.org/">Vue.JS</a>作為網站框架，<a href="https://vitepress.dev/">VitePress</a>用於生成靜態網頁。</p>
    <p>本站使用<a href="https://pages.github.com/">GitHub Pages</a>進行資料<b>託管</b>，並使用<a href="https://aws.amazon.com/cloudfront/">AWS CloudFront</a>進行<b>CDN加速</b>。</p>
    <p>本站使用<a href="https://marketingplatform.google.com/about/analytics/">Google Analytics</a>與<a href="https://clarity.microsoft.com/">Microsoft Clarity</a>進行使用者訪問資料收集，以便更好改善體驗並除錯問題。這些資料都是匿名的，除非您主動提供相關資訊，否則我們無法追蹤到您。</p>
    <h2>使用的資料</h2>
    <p>部分人物資訊來自<a href="https://schaledb.com/">SchaleDB</a>。</p>
    <p>故事資訊來自第三方提供的遊戲內資料，所有這些資料均屬於其各自的權利人及著作者。</p>
  </div>
  <div v-show="setting.ui_lang === 'en'">
    <h1 class="view-h1" id="disclaimer">Disclaimer</h1>
    <p>This site is not affiliated in any forms with Blue Archive, Yostar, Nexon and Nexon Games.</p>
    <p>All game artwork, information and assets used in this site are the property and copyright of the respective authors.</p>
    <p>This site is only for data showcase.</p>
    <h1 class="view-h1">About This Site</h1>
    <h2>Technology Used</h2>
    <p>The development of this project can be divided into two parts (<b>frontend</b> and <b>backend</b>), where different programming languages and frameworks are employed respectively.</p>
    <p><b>Backend</b> uses <a href="https://python.org">Python</a> to pre-process the original data (provided by third-party) before being used to display on the website.</p>
    <p><b>Frontend</b> uses <a href="https://vuejs.org/">Vue.JS</a> as the framework, and <a href="https://vitepress.dev/">VitePress</a> as the static site generator.</p>
    <p>The data is <b>served</b> with <a href="https://pages.github.com/">GitHub Pages</a>, and <a href="https://aws.amazon.com/cloudfront/">AWS CloudFront</a> is used for <b>CDN acceleration</b>.</p>
    <p>This site uses <a href="https://marketingplatform.google.com/about/analytics/">Google Analytics</a> and <a href="https://clarity.microsoft.com/">Microsoft Clarity</a>to collect user behavioral data, so as to better improve the experience and debug the problems. All of the said data are anonymous and there's no way of tracking unless you provide the data to us.</p>
    <h2>Data Used</h2>
    <p>Part of the character data is from <a href="https://schaledb.com/">SchaleDB</a>.</p>
    <p>All of the in-game story data is provided by a third-party, all of which belong to their respective rights holders and authors.</p>
  </div>
</template>

<style>
</style>