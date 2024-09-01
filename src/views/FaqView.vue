<script setup lang="ts">
import { useSetting } from '@/stores/setting'

const setting = useSetting()
</script>

<template>
  <div v-show="setting.ui_lang === 'zh_CN'">
    <h1 class="view-h1">FAQ/常见问题</h1>
    <h2>为什么找不到xx故事？</h2>
    <p>本站数据理论上是覆盖所有游戏内故事的，您可直接通过 <code>/scenario/<i>[故事ID]</i></code> 的形式直接进行访问。</p>
    <p>如您是通过搜索功能查找故事的，则表明该故事暂未被索引。您可在项目的这一<a href="https://github.com/orgs/BA-L10N-Viewer/discussions/1">讨论帖子</a>中向开发者说明情况<del>并催更</del>。</p>
    <h2>为什么数据会有延迟？</h2>
    <p>尽管本站后端在一开始确实按照“最大化自动脚本”的方向实现，但实践中发现很多内容仍需人工介入，如不人工介入则可能导致数据错误，于是最终放弃了使用GitHub Action等自动化CI/CD工具的想法。</p>
    <p>本站开发者是<b>2025届高考生</b>，写作本文时已进入高三复习阶段。由于学校周末仅有半天时间，故可能出现数据严重滞后的情况。您可以<b>在上方的讨论帖中留言提醒</b>，或是<b>考虑成为一名数据维护者</b>（请先通过项目讨论版联系）。</p>
    <h2>为什么部分故事是空白的？</h2>
    <p>游戏中的故事展现形式多样，但因为本站的主要意图为<b>供玩家横向比较本地化文本</b>，因而在数据处理中过滤掉了没有本地化文本的纯脚本部分。</p>
    <p>部分主线故事，如<RouterLink to="/scenario/21035">游戏开发部篇第一章第三话的战斗后故事</RouterLink>，脚本处理后仅保留了“下一话”的显示内容。这是因为这一故事并不具备实际文本/对话内容，其作用仅仅是描述了结束故事的动画应如何呈现。</p>
    <h2 id="bug-report">数据有误！网站工作不正常！</h2>
    <p>请在GitHub讨论版的<a href="https://github.com/orgs/BA-L10N-Viewer/discussions/categories/bug-%E6%95%B0%E6%8D%AE%E9%94%99%E8%AF%AF%E5%9B%9E%E6%8A%A5">此分类</a>下发帖告知。告知时请提供：</p>
    <ul>
      <li>错误的具体位置（链接等）</li>
      <li>网站截图</li>
      <li>复现方法</li>
      <li>访问时间（非必要）</li>
    </ul>
    <p>如遭遇技术问题（排版错位/功能交互异常），除了以上的必要内容外，您还可以选择同时报告以下信息：</p>
    <ul>
      <li>浏览器版本</li>
      <li>访问时间</li>
    </ul>
    <p>提交以上信息可协助我们通过Microsoft Clarity具体定位到您的访问会话并观察您的访问行为，进而帮助我们更好定位问题。</p>
  </div>
  <div v-show="setting.ui_lang === 'zh_TW'">
    <h1 class="view-h1">FAQ/常見問題</h1>
    <h2>為什麼找不到xx故事？</h2>
    <p>本站資料理論上是覆蓋所有遊戲內故事的，您可直接透過 <code>/scenario/<i>[故事ID]</i></code> 的形式直接進行訪問。</p>
    <p>如您是透過搜尋功能查詢故事的，則表明該故事暫未被索引。您可在專案的這一<a href="https://github.com/orgs/BA-L10N-Viewer/discussions/1">討論帖子</a>中向開發者說明情況<del>並催更</del>。</p>
    <h2>為什麼資料會有延遲？</h2>
    <p>儘管本站後端在一開始確實按照“最大化自動指令碼”的方向實現，但實踐中發現很多內容仍需人工介入，如不人工介入則可能導致資料錯誤，於是最終放棄了使用GitHub Action等自動化CI/CD工具的想法。</p>
    <p>本站開發者是<b>2025屆高考生</b>，寫作本文時已進入高三複習階段。由於學校週末僅有半天時間，故可能出現數據嚴重滯後的情況。您可以<b>在上方的討論帖中留言提醒</b>，或是<b>考慮成為一名資料維護者</b>（請先透過專案討論版聯絡）。</p>
    <h2>為什麼部分故事是空白的？</h2>
    <p>遊戲中的故事展現形式多樣，但因為本站的主要意圖為<b>供玩家橫向比較本地化文字</b>，因而在資料處理中過濾掉了沒有本地化文字的純指令碼部分。</p>
    <p>部分主線故事，如<RouterLink to="/scenario/21035">遊戲開發部篇第一章第三話的戰鬥後故事</RouterLink>，指令碼處理後僅保留了“下一話”的顯示內容。這是因為這一故事並不具備實際文字/對話內容，其作用僅僅是描述了結束故事的動畫應如何呈現。</p>
    <h2 id="bug-report">資料有誤！網站工作不正常！</h2>
    <p>請在GitHub討論版的<a href="https://github.com/orgs/BA-L10N-Viewer/discussions/categories/bug-%E6%95%B0%E6%8D%AE%E9%94%99%E8%AF%AF%E5%9B%9E%E6%8A%A5">此分類</a>下發帖告知。告知時請提供：</p>
    <ul>
      <li>錯誤的具體位置（連結等）</li>
      <li>網站截圖</li>
      <li>復現方法</li>
      <li>訪問時間（非必要）</li>
    </ul>
    <p>如遭遇技術問題（排版錯位/功能互動異常），除了以上的必要內容外，您還可以選擇同時報告以下資訊：</p>
    <ul>
      <li>瀏覽器版本</li>
      <li>訪問時間</li>
    </ul>
    <p>提交以上資訊可協助我們透過Microsoft Clarity具體定位到您的訪問會話並觀察您的訪問行為，進而幫助我們更好定位問題。</p>
  </div>
  <div v-show="setting.ui_lang === 'en'">
    <h1 class="view-h1">FAQ / Frequently Asked Questions</h1>
    <h2>Why I can't find XXX story?</h2>
    <p>In theory, we cover all of the in-game story, and you may directly access that with the path like <code>/scenario/<i>[故事ID]</i></code>.</p>
    <p>If you're viewing stories with the built-in search function, it'll be the case that the said story hasn't been indexed. You can leave a comment in this <a href="https://github.com/orgs/BA-L10N-Viewer/discussions/1">discussion thread</a> to notify the developer about it.</p>
    <h2>Why the data is lagging behind?</h2>
    <p>Despite the fact that we do design the backend part to run automatically as far as we can, we still find that manual work is required in the most of the case. To save the time and avoid confusion, we gave up CI/CD tools like GitHub Action and decided to manually maintain the data.</p>
    <p>The developer of this site is a <b>Grade 12 student preparing for Gaokao</b>, and has since been in the review stage of the exam preparation, causing the data to delay. You can notify about that <b>in the discussion thread mentioned above</b>, or <b>consider becoming a data maintainer</b> (please contact in advance in the GitHub Discussion).</p>
    <h2>Why some stories are blank?</h2>
    <p>Blue Archive uses multiple methods to present the story, however the main intent of this site is to <b>make it easier for players to compare <i>localizations</i></b>, and therefore, all non-text (pure script) parts are filtered out.</p>
    <p>Some main stories, like <RouterLink to="/scenario/21035">the one after the battle of Vol.2 Ch. 1 Ep. 3</RouterLink>, the data only contains the preview of the next story. This is caused for the fact that this story file only describes how the <i>To Be Continued</i> part to be played without any actual text and/or dialogues.</p>
    <h2 id="bug-report">Data is incorrect! / The site is malfunctioning!</h2>
    <p>Please report that in this <a href="https://github.com/orgs/BA-L10N-Viewer/discussions/categories/bug-%E6%95%B0%E6%8D%AE%E9%94%99%E8%AF%AF%E5%9B%9E%E6%8A%A5">GitHub Discussion category</a>. When reporting, please also provide the additional data:</p>
    <ul>
      <li>Where (e.g. links)</li>
      <li>Screenshot</li>
      <li>Reproduction Steps</li>
      <li>Time of Access (optional)</li>
    </ul>
    <p>If you're experiencing technical problems (e.g. Typographical misalignment/Abnormal function interactions), you can also submit additional info listed below:</p>
    <ul>
      <li>Browser Version (User-Agent)</li>
      <li>Time of Access</li>
    </ul>
    <p>By providing the info above, we may be able to track your session (using Microsoft Clarity) and better resolve the problems.</p>
  </div>
</template>

<style scoped>

</style>