<template>
  <h1>Story data problem</h1>

  <h2>Q: Why is there no xx story data? Why does the content after the international server update still not exist?</h2>
  <p>A: Under normal circumstances, the data of this site should be able to keep up with the update speed of the Japanese and international servers in time, and can be synchronized within one to two hours after the update. However, since this site relies on <b>third-party data</b> and uses <b>CDN cache</b>, problems with either of them will cause the data to not be synchronized and updated in time.</p>
  <p>When encountering untimely data updates, the following may be the reasons:</p>
  <ul>
    <li>The browser cache is not refreshed (press Ctrl+F5 on the PC to force a refresh)</li>
    <li>CloudFlare (main site)/AWS (acceleration site) cache is not refreshed</li>
    <ul>
      <li>If you are using AWS Accelerator Station (ba-l10n<b>-aws</b>.cnfast.top), please visit the <a href="https://ba-l10n.cnfast.top/">main site</a> to confirm the situation first.</li>
    </ul>
    <li>The GitHub Actions script did not run properly or missed the actual run time. See the <a href="#when-update">Data Update Time</a> section.</li>
    <li>Third-party data sources are delayed or unavailable</li>
  </ul>

  <h2>Q: Why can't I find the main story/activity story of xx? Why does the data show "L10N unmapped"?</h2>
  <p>A: Unlike bond stories, the raw data of the main/event stories does not specify the relationship between related stories and their names, or concise localized data, so these data need to be manually indexed.</p>
  <p>Specifically, the chapter and chapter titles, story numbers, names, and introductions of the main stories (main quest, clubs (side quests), short stories, and others) all need to be manually indexed, while the names and introductions of the activity stories are displayed as "L10N unmapped" by default.</p>
  <p>In the former case, the data cannot be accessed unless you know the story number; in the latter case, the data can be accessed in the normal way, but the associated name and description information is missing.</p>

  <h2>Q: Why is some data empty? Why is some data "LocalizeError"?</h2>
  <p>A: Regarding the story: some post-battle stories, such as the post-battle story of <RouterLink to="/scenario/21035">Game Development Department Chapter 1 Episode 3 (V2C1E3)</RouterLink>, the actual text content is only a preview of the next episode, that is, it is only used for transition.</p>
  <p>For others: There are several situations that may cause the data to be empty:</p>
  <ul>
    <li>Due to the difference in progress between the Japanese and international servers, some data may only be available on the Japanese server.</li>
    <li>The bug of script, some data items may be swallowed</li>
  </ul>
  <p>In addition, since the main purpose of this site is to allow players to <b>compare text differences horizontally</b>, all non-text content will be filtered out to save data. </p>
  <p>As for the situation where some data items are "LocalizeError" and other values, it is speculated that the data is filled in by the lagging servers such as the international server for code compatibility, which is invalid data itself. </p>

  <h2>Q: When using machine translation, which languages are generally better to translate?</h2>
  <p>A: Generally speaking, <strong>English</strong> would be a more common choice.</p>
  <p>Based on our experience, Google Translate will use English as the intermediate language for translation when the source language or target language is not English. In other words, whether it is Chinese-Japanese or Chinese-Korean translation, the content must be translated into English first and then translated into the target language. </p>
  <p>Given that Google Translate itself isn't very accurate (except perhaps when translating to English), we recommend using English as your primary language of choice.</p>

  <h2>Q: When is the data updated?</h2>
  <p>A: Currently, GitHub Action checks for data updates at the following times:</p>
  <ul>
    <li>UTC+8 13:00, 14:00, 15:00, 17:00, 18:00, 20:00</li>
    <li>UTC/GMT 05:00, 06:00, 07:00, 09:00, 10:00, 12:00</li>
  </ul>
  <p>For the mainline and activity data mentioned above, data maintainers need to intervene manually. You can also consider <a href="#be-a-maintainer">becoming a data maintainer</a> and directly participate in the construction and maintenance.</p>

  <h1>Character Voice</h1>

  <h2>Q: Why is there no battle section in ScheDB's data?</h2>
  <p>A: For a long time, things like student growth, favorability improvement, and all combat voices were <b>unsubtitled</b>. It wasn't until a few months after the third anniversary of the Japanese server that relevant voice subtitles were added. However, they were only displayed when the character voice page was playing, and the voice displayed on the page itself was not very complete.</p>
  <p>Since ScheDB has not yet added voice text for the battle part (2024.11.16), in order to save data, this site specifically removed this part of the data during data processing.</p>

  <h2>Q: What does the "language code" on the voice page mean?</h2>
  <p>A: The language code of this site can be divided into three parts: <i>[Server abbreviation]</i>, <em><i>[Language code abbreviation]</i></em>, <i>[Optional, target language to convert to]</i>.</p>
  <ul>
    <li>Server abbreviations: <code>j</code>, Japanese server; <code>g</code>, international server; <code>c</code>, Chinese server</li>
    <li>Language code abbreviations: <code>ja</code>, Japanese; <code>ko</code>, Korean; <code>en</code>, English; <code>th</code>, Thai; <code>tw</code>, Traditional Chinese (Taiwan); <code>cn</code>, Simplified Chinese (Mainland China)</li>
    <li>Target language: <code>tw</code>, converted to Traditional Chinese (Taiwan) words and characters; <code>cn</code>, converted to Simplified Chinese (Mainland China) words and characters</li>
  </ul>
  <p>For example, <code>g_ja</code> means "Japanese data for the international server", while <code>g_tw_cn</code> means "data converted from Traditional Chinese to Simplified Chinese for the international server".</p>

  <h2>Q: In general UI, what do "Enter", "Idle" and "Exit" mean? </h2>
  <p>A: The so-called "Enter", "Idle" and "Exit" actually come from the encoding and naming rules of each voice at the bottom of BA, representing different states triggered by voice. </p>
  <p>Taking the task menu as an example, the state of the interface and voice will actually undergo the following changes:</p>
  <ul>
    <li>When entering (from the game homepage lobby, etc.), the turntable of Alona/Prana will be switched immediately, and the "enter" voice will be played</li>
    <li>After the playback, enter the <em>idle</em> state, and the "idle" voice will be played automatically</li>
    <li>When interacting with Alona/Prana, switch to the <em>exit</em> state first, and play the "exit" voice</li>
    <li>Alona/Prana jumps to the front, enters the <em>enter</em> state, and plays the "enter" voice</li>
    <li>After the playback, enter the <em>idle</em> state, and if you continue to interact, the "idle" voice will be played</li>
  </ul>
  <p>For general halls:</p>
  <ul>
    <li>When entering or returning to the homepage lobby from other interfaces, the lobby will first switch to the <em>enter</em> state and play the "enter" voice</li>
    <li>After the playback is finished, it will enter the <em>idle</em> state. If you continue to interact, the "idle" voice will be played</li>
    <li>Most voices generally belong to the "enter" or "idle" states, because there is basically no scenario where you need to play voice when "exiting". </li>
  </ul>

  <h2>Q: What does the "model number" seen under the General/Lobby category mean? </h2>
  <p>A: Some students, such as Misaki, Atsuko, Saori, Wakamo, etc., actually have two sets of illustrations in their halls. In the data, these two sets of illustrations correspond to two different sets of voices; although most of the voice files and texts are exactly the same, we still found that the texts of some languages are not unified during the process, so we decided to keep them. </p>

  <h2>Q: Why are the voice instructions different from those in the game/SchaleDB? </h2>
  <p>A: Although the voice illustrations in the game and ScheDB do provide simple explanations for each voice, in practice we found that these explanations are not accurate and can easily confuse people. </p>
  <p>For example, the "formation" in ScheDB should be more accurately written as "formation inclusion". For "formation selection" which is difficult to describe in itself (users' perception is more like the voice of "lifting up" the little man), we have added additional explanations. </p>

  <h2>Q: What does "protagonist" mean in the voice names of Arona/Prana? </h2>
  <p>A: This involves the definition of "background"/"scene" in the task menu at the bottom of BA. We can answer this question from the surface behavior and the bottom system naming method of the voice. </p>
  <p>You may have noticed that in the scene where Arona and Prana appear together, sometimes there may be a situation where "the other can never be called up": for example, in the scene where Prana peeks at Arona sleeping behind the wall, no matter how you click, Prana cannot be called up, only Arona. A major feature of these scenes is that the background is sky blue - obviously, it is Arona's room, which is the meaning of the so-called "protagonist" identity. </p>
  <p>From the bottom data, the voice of this scene is uniformly named UIWorkCoexist_AronaSleepPeekEnter/Idle/Exit, indicating that the voice is triggered when the two "appear at the same time" (coexist), "Arona is sleeping" (AronaSleep), and Prana is "peeking" (Peek). As you can see, there is only "Arona" in the numbering, but no "Plana", which naturally indicates that this scene is Arona's home court, and of course it is Arona who will respond to your request. </p>

  <h2>Q: Voiceovers of some special characters</h2>
  <p>A:</p>

  <h2>Q: What does "activity type" mean in character voice? What's the significance? </h2>
  <p>A: Practice has shown that the BA underlying layer treats each round of activities (whether it is the first implementation or the remake) as two completely different activities. As Yemao Lao said in a post, the level stars of different activities will be counted independently. Due to this underlying feature, character voice is naturally no exception. </p>
  <p>When analyzing the data, we found that the activity dialogues in some early activities were retranslated and rolled back many times, and the content was not completely consistent; although this is no longer seen in most current activities, we think this is an interesting discovery and decided to keep it. </p>

  <h1>General</h1>

  <h2>Q: Why does it only support up to three languages (PC)/five languages (mobile)? </h2>
  <p>A: For PC, horizontal display of three languages is already the limit of a general 16:9 screen, and it is meaningless to add more languages. </p>
  <p>As for why it only supports up to five languages, it is because BA only supports five languages except the Chinese server (there is no data for the Chinese server); at the same time, as mentioned above, too many languages are meaningless. </p>
  <p>However, if you really need to obtain localized data for all languages, you should consider directly parsing JSON or exporting CSV (under development). </p>

  <h2>Q: I want to be a data maintainer!</h2>
  <p>A: If you want to become a data maintainer, you should have at least the following experience:</p>
  <ul>
    <li>Basic Python programming skills (debugging is best)</li>
    <li>Basic JSON syntax</li>
    <li>Basic use of at least one mainstream code editor</li>
    <li>Japanese (<strong>not necessary</strong>, but it will be more convenient when updating localized indexes)</li>
    <li>Ability to access and use GitHub normally</li>
  </ul>
  <p>Then please contact us through the contact information on the <RouterLink to="/about">About page</RouterLink>. We will briefly explain your situation and the specific arrangements and circumstances. </p>

  <h2>Q: I found a bug!</h2>
  <p>A: Please report the problem on the project's <a href="https://github.com/orgs/BA-L10N-Viewer/discussions">discussion board</a>. When reporting, please provide:</p>
  <ul>
    <li>Where did it happen? (full URL)</li>
    <li>Can it be reproduced? What are the steps to reproduce?</li>
    <li>How does it affect the experience?</li>
    <li>Other information (optional, this will allow us to track your session)</li>
    <ul>
      <li>Access time</li>
      <li>The browser you are using and its version</li>
    </ul>
  </ul>

</template>


