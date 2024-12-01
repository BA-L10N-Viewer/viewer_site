<script setup lang="ts">
import PvMessage from 'primevue/message'
</script>

<template>
  <h1 class="view-h2">FAQs</h1>
  <PvMessage size="large" severity="warn">You're now reading a Google Translated (w/ small manual changes) version of the FAQ.<br />The translation might be incorrect or updated. For in-time and updated version, change the site language to Chinese (Simplified/Traditional) to view.</PvMessage>

  <h2>Story Data</h2>
  <h3>Q: Why is there no data for XX story? Why does Global's data still not exist when updates are already in place?</h3>
  <p>A: Normally, the data should be able to keep up with the JP and Global in time, with a maximum delay of one to two hours. However, since this site relies on <b>third-party data</b> and uses <b>CDN</b>, problems with either of them will cause the data to not be synced and updated in time.</p>
  <p>When encountering untimely data updates, the following may be the reasons:</p>
  <ul>
    <li>Browser cache hasn't expire (for PC, press Ctrl+F5 to force clear the cache)</li>
    <li>The cache of CloudFlare (main site) and/or AWS (accelerated site) hasn't refreshed</li>
    <ul>
      <li>If you are using AWS accelerated site (ba-l10n<b>-aws</b>.cnfast.top), please visit the <a href="https://ba-l10n.cnfast.top/">main site</a> to confirm the situation first.</li>
    </ul>
    <li>The GitHub Actions script did not run properly or missed the scheduled time. See the <a href="#when-update">Data Update Time</a> section for more.</li>
    <li>Third-party data sources are delayed or unavailable</li>
  </ul>

  <h3>Q: Why can't I find the main story/event story of XX? Why does the data show "L10N unmapped"?</h3>
  <p>A: Unlike bond stories, the raw data of the main/event stories does not specify the relationship between stories and their names, or any localization data. So these data need to be manually indexed.</p>
  <p>Specifically, for main stories (main, side (club), short and other), the names/descriptions for volume/chapter/stories and the story IDs, all need to be manually indexed; while the names and descriptions of the event stories are displayed as "L10N unmapped" by default.</p>
  <p>In the former case, the data cannot be accessed unless you know the story number; in the latter case, the data can be accessed by normal means, except the fact that the associated name and description are missing.</p>

  <h3>Q: Why is some data empty? Why does some data show "LocalizeError"?</h3>
  <p>A: For stories: some post-battle stories, such as the post-battle story of <RouterLink to="/scenario/21035">Volume 2, Chapter 1, Episode 3</RouterLink>, the actual data that contains text is only a preview of the next episode - that is, it is only used for "To Be Continued" transition.</p>
  <p>For others: There are several situations that may cause the data to be empty:</p>
  <ul>
    <li>Due to the difference in progress between the JP and Global, some data may only be available on the Japanese server</li>
    <li>A bug in the scripts could eat some data entries</li>
  </ul>
  <p>In addition, since the main purpose of this site is to allow players to <b>compare localization differences horizontally</b>, all non-text content will be filtered out to reduce data usage and avoid performance issues.</p>
  <p>As for the case where some data items are "LocalizeError" or other values, it is speculated that the data is <i>filled in</i> for code compatibility, which is essentially invalid data as well.</p>

  <h3 id="when-update">Q: When is the data updated?</h3>
  <p>A: Currently, GitHub Action checks for data updates at the following times:</p>
  <ul>
    <li>UTC+8 13:00, 14:00, 15:00, 17:00, 18:00, 20:00</li>
    <li>UTC/GMT 05:00, 06:00, 07:00, 09:00, 10:00, 12:00</li>
  </ul>
  <p>For the main story and event story data mentioned above, they all require manual interventions. You can also consider <a href="#be-a-maintainer">becoming a data maintainer</a> and directly participate in the construction and maintenance of the project.</p>


  <h2>Character Voicelines</h2>
  <h3>Q: Why is there no battle section in ScheDB's data?</h3>
  <p>A: For a long time, voicelines like student growth, bond level increments, and all combat voices were <b>unsubtitled</b>. It wasn't until a few months after the third anniversary of the JP server that the subtitles were added. However, they are only displayed in the character profile page, and what's more, the voice displayed on the page was not complete at all.</p>
  <p>Since ScheDB has not yet added voice text for the battle voicelines (2024.11.16), in order to reduce data usage, BALV has specifically removed this part of the data during data pre-processing.</p>

  <h3>Q: What does the "Lang Code" on the voicelines page mean?</h3>
  <p>A: The language code of this site can be divided into three parts: <i>[Server abbr.]</i>, <em><i>[Langcode abbr.]</i></em>, <i>[Optional; Target Language of the Conversion]</i>.</p>
  <ul>
    <li>Server abbr.: <code>j</code>, JP server; <code>g</code>, Global server; <code>c</code>, CN server</li>
    <li>Language code abbr.: <code>ja</code>, Japanese; <code>ko</code>, Korean; <code>en</code>, English; <code>th</code>, Thai; <code>tw</code>, Traditional Chinese (Taiwan Region); <code>cn</code>, Simplified Chinese (China Mainland)</li>
    <li>Target language: <code>tw</code>, converted to Traditional Chinese (Taiwan Region); <code>cn</code>, converted to Simplified Chinese (China Mainland)</li>
  </ul>
  <p>For example, <code>g_ja</code> means "Global server, Japanese", while <code>g_tw_cn</code> means "Global Server, Traditional Chinese (Taiwan Region), converted to Simplified Chinese (China Mainland)".</p>

  <h3>Q: What does "event type" mean in character voice? What's the significance? </h3>
  <p>A: At its roots, BA regards every individual event run (be it the first time or rerun) as completely separate ones. This can be proven by the fact that the stars for every level in every event is calculated individually. Due to this coding characteristic, character voicelines are no exceptions for that as well - in other words, voiceline entries are all duplicate.</p>
  <p>When analyzing the data, we found that some event dialogues demonstrate a feature of being retranslated and/or reverted several times, especially during the early days. The content in question was not completely consistent; although this is no longer seen frequently in most later events, we considered it an interesting discovery and decided to keep it. </p>

  <h3>Q: In UIs like main lobby, what do "Enter", "Idle" and "Exit" mean? </h3>
  <p>A: The so-called "Enter", "Idle" and "Exit" actually come from the ID naming of each voice (from a programming perspective), representing different states triggered in given circumstances. </p>
  <p>Take the Mission Menu as an example. The state of the interface and voice will undergo the following changes:</p>
  <ul>
    <li>When entering (from the game homepage lobby, etc.), the state of Alona/Prana will be randomly switched immediately, and the "enter" voice will be played</li>
    <li>After the playback, the <em>idle</em> state will be entered, and the "idle" voice will be played <u>automatically</u></li>
    <li>When interacting with Alona/Prana, switch to the <em>exit</em> state first, and play the "exit" voiceline</li>
    <li>Alona/Prana jumps to the front, the <em>enter</em> state will be entered, and plays the "enter" voice</li>
    <li>After the playback, the <em>idle</em> state will be entered, and the "idle" voice will only be played if you interact again</li>
  </ul>
  <p>For the main lobby:</p>
  <ul>
    <li>When entering or returning to the homepage lobby from other interfaces, the lobby will first switch to the <em>enter</em> state and play the "enter" voice</li>
    <li>After the playback is finished, the <em>idle</em> state will be entered. If you continue to interact, the "idle" voice will be played</li>
  </ul>
  <p>Most voices generally belong to the "enter" or "idle" states, since there is basically no circumstances where you need to play voice when "exiting". </p>

  <h3>Q: What does the "Costume #" column mean? </h3>
  <p>A: Some students, such as Misaki, Atsuko, Saori, Wakamo, etc., have two sets of portraits in the main lobby. In the data, these two portraits correspond to two different sets of voicelines; although most of the voice files and texts are exactly the same, we still found that the texts of some languages are not consistent during our analysis, so we decided to keep them. </p>

  <h3>Q: Why are the voiceline names different from those in-game/SchaleDB? </h3>
  <p>A: Although the voiceline naming in the game and SchaleDB do provide simple explanations for each voice, in practice we found that some of these explanations are not accurate and can easily confuse people. </p>
  <p>For example, the "Formation" in SchaleDB should be more accurately written as "Formation In". For "Formation Select", which is difficult to describe in itself (users' perception is more akin to the voice when long-pressing to "pick up" the chibi models), we have added additional explanations. </p>

  <h3>Q: What does "main character" mean in the voice names of Arona/Plana? </h3>
  <p>A: This involves the definition of "background"/"scene" in the Mission Menu. We can answer this question from its surface behavior and the systematic naming in the voiceline data. </p>
  <p>You may have noticed that in scenes where Arona and Plana appear together, sometimes there may be a situation where "the other can never be called out": for example, in the scene where Plana peeks at Arona sleeping behind the wall, no matter how you click, Prana cannot be called up, only Arona. A major feature of these scenes is that the background color is sky blue - obviously, it is Arona's room, which is pretty self-explanatory itself. </p>
  <p>From the perspective of actual data, the voice of this scene is uniformly named as  <i>UIWorkCoexist_AronaSleepPeekEnter/Idle/Exit</i>, indicating that the voice is triggered when the two "appear at the same time" (coexist), "Arona is sleeping" (AronaSleep), and Plana is "peeking" (Peek). As you can see, there is only "Arona" in the naming, but no "Plana", which naturally indicates that this scene is Arona's room, and of course it is Arona who will respond to your request. </p>

  <h3>Q: Special Characters IDs</h3>
  <p>A:</p>


  <h2>General</h2>

  <h3>Q: Why does it only support up to three languages (PC)/five languages (mobile)? </h3>
  <p>A: For PC, displaying three languages horizontally is already a struggle for 16:9 screen, and it is meaningless to add more languages. </p>
  <p>As for why it only supports up to five languages, it is because BA only supports five languages (excluding the CN server, since there is no data from it); at the same time, as mentioned above, too many languages are meaningless. </p>
  <p>However, if you really need to obtain localized data for all languages, you should consider directly parsing JSON or exporting CSV (under development). </p>

  <h3 id="be-a-maintainer">Q: I want to be a data maintainer!</h3>
  <p>A: If you want to become a data maintainer, you should have at least the following experience:</p>
  <ul>
    <li>Basic Python programming skills (if you can debug then it'd be better)</li>
    <li>Basic JSON syntax knowledge</li>
    <li>Basic knowledge of at least one mainstream code editor</li>
    <li>Japanese (<strong>optional</strong>, but it'd be more convenient when updating localized indexes)</li>
    <li>Basic knowledge of GitHub</li>
  </ul>
  <p>Then, please contact us through the contact information on the <RouterLink to="/about">About page</RouterLink>. We will briefly explain the situation and the specific arrangements.</p>

  <h3 id="report-bug">Q: I found a bug!</h3>
  <p>A: Please report the problem on the project's <a href="https://github.com/orgs/BA-L10N-Viewer/discussions">discussion board</a>. When reporting, please provide:</p>
  <ul>
    <li>Where did it happen? (full URL)</li>
    <li>Can it be reproduced? What are the steps to reproduce?</li>
    <li>How does it affect the experience?</li>
    <li>Other information (optional, this will allow us to track your session)：
      <ul>
        <li>Time of Access</li>
        <li>Browser version</li>
      </ul>
    </li>
  </ul>

  <h3>Q: When using machine translation, what's the preferred target language?</h3>
  <p>A: Generally speaking, <strong>English</strong> would be the best choice.</p>
  <p>Based on our experience, Google Translate will use English as the intermediate language for translation when the source language and/or target language is not English. In other words, whether it is Chinese-Japanese or Chinese-Korean translation, the content must be translated into English first and then translated into the target language. </p>
  <p>Given that Google Translate itself isn't very accurate (except perhaps when translating to English), we recommend using English as your primary language of choice.</p>
</template>
<script setup lang="ts">
</script>