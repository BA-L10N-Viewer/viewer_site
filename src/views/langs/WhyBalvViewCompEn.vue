<script lang="ts" setup>
import PvMessage from 'primevue/message'
</script>

<template>
  <h1 class="view-h1">Why BA L10N Viewer</h1>
  <p>
    BA L10N Viewer (BALV), the site itself, isn't really just a gacha game hobbiest trying to
    practice his frontend development skills. <strong>Not at all, really.</strong>
  </p>
  <p>
    Despite its simple and shabby UI and lacking a lot of functionalities, my original intent that
    is <em><strong>cross-language comparison</strong></em
    >, have never changed that much. At its core, BALV is tool dedicated for language learners and
    people who are curious about localization differences across different languages. But now,
    apparently, something more significant is happening, going on right now as I'm writing this
    article.
  </p>
  <p>The VERY BAD, VERY UNPROFESSIONAL LOCALIZATION that we're all seeing in-game.</p>

  <PvMessage severity="info"
    >However, with the awesome work by Twitter user <a href="https://x.com/TL2TJ">TL2TJ</a>, it's
    possible for us to fix the translation issues by OURSELVES.<br />
    His unofficial mod for Blue Archive Global, as of the writing, is completely usable and safe,
    making BALV less useful right now.<br />
    Despite this, BALV is still here to provide an easy access to in-game localization for
    everyone.<br />
    <b>Have fun reading then!</b></PvMessage
  >

  <h2>Bad Localization Exists</h2>
  <p>
    The global version of Blue Archive, especially its English branch, has long been known to have
    bad, improper localization for ages. From Reddit slangs to mistranslations, to now inexplictedly
    and intentionally changing the whole sentence and dialogues, dissatisfaction with the
    localization team only grew more and more among the players.
  </p>
  <p>
    As far as I can tell, starting from May 2024, when Kikyou was added to the global version, a
    collaborative effort has been made to force Nexon re-translating some dialogues and stories, by
    flooding Nexon's customer feedback portal. Eventually the players won, and multiple changes
    landed safely as expected. From then on, a lot of players (notably the JP and KR players) have
    joined the team and been helping people to get aware of the ongoing situation.
  </p>
  <p>
    The aim of this website, BA L10N Viewer, aligns with all the translators: to let people know bad
    localization exists. BALV tries to provide people with an easy access to in-game data, allowing
    everyone to compare them cross-language-ly, with or without any foreign languages skills by
    having built-in Google Translate feature to fact check quickly and accurately.
  </p>
  <p>
    Currently, BALV covers data of Scenarios (story), Momotalk and Character Voicelines (Character
    Profile WIP), where most localization errors take place and are being pointed out. It's a truly
    tool built for everyone, at its roots.
  </p>

  <h2>JP or KR, which one?</h2>
  <p>
    It might come as a surprise for some people, but the truth is, Blue Archive is a Korean
    developed by a Korean game company named Nexon Games. By this means, Blue Archive has all its
    scripts written in Korean, not Japanese. This creates an interesting situation that we also, can
    easily observe when an localization strike strikes.
  </p>
  <p>
    As the old saying goes, "No two leaves are exactly the same", that applies to the field of
    translation as well. Unless it's all machine translated or a mistranslation, usually you'll get
    small variations across all translated versions, but the meaning is basically the same overall.
  </p>
  <p>
    For BA however, the localization scheme is a little more complex. First of all, English, Thai,
    and even Japanese are all based on Korean scripts - so, in a sense, they should all be similar,
    right?
  </p>
  <p>
    Well, not exactly. When people do translations, they usually follow either of these two
    principles: keep the content as is, or change some elements to fit in the local culture. Usually
    the first method is going to stick to the original better, but may cause confusion due to
    cultural differences. For the JP version of BA, Yostar, the publisher of the JP region, have its
    localization be done in the second method - change elements to more suitable for JP market. To
    be clear, <strong>it's NOT UNUSUAL for localization team to do so</strong>, and considering that
    BA is a game that mainly aims for JP market, it makes sense for them to do so.
  </p>
  <p>
    We actually have an instance for that when the localization team did that with the first method.
    During the JP release of the event <em>Rowdy and Howdy</em>, a lot of Japanese users complained
    about the <em>unnatural</em> word choices and <em>weird</em> grammar of the event story. It was
    then revealed later through an official apology letter that, the situation was caused by a
    request from the developers to <strong>keep most of the story as is</strong>. Since that didn't
    go well as expected, you can see it's generally not a good method doing translations.
  </p>
  <p>
    With that in mind, we can now conclude an important fact that is: JP is NOT REFELCTING the
    original <em>THAT</em> well. However, given the fact that JP is ahead of the global by half a
    year, understandably, people will treat the JP localization as the <em>correct</em> one, raising
    questions about localizations that are in fact, based on Korean scripts.
  </p>
  <p>
    An exception to this KR-based rule is probably the Chinese (Traditional) localization. As far as
    I know, it appears to me that the Chinese localization is based on Japanese instead of Korean -
    this could be Nexon trying to cater the market's demand.
  </p>
  <p>
    Thanks to the differences of Korean and Japanese scripts, some players are now suspecting that
    the Chinese (Simplified) version (used on CN server) could be based on Korean scripts.
  </p>
  <p>
    TL;DR: English, That, Japanese are all based on Korean, Chinese (Simplified) is suspected to be
    based on Korean as well, and Chinese (Traditional) is said to be based on Japanese. Some
    "mistranslations" we're seeing are purely the differences between Korean and Japanese scripts.
  </p>

  <h2>What can we do, then?</h2>
  <p>
    With the ongoing localization disaster, we're hoping that everyone can participate in the
    process of fact checking and verifying the English localization with the minimum costs. You
    don't need to have multiple in-game extracts or open the game and screenshot them one by one,
    and you maybe don't even need to necessarily know how to read Korean/Japanese.
  </p>
  <p>
    However, it might not be necessary to force the localization team to make their changes -
    because we're essentially building our own localization team right now. With the great work done
    by Twitter user <a href="https://x.com/TL2TJ">TL2TJ</a> and the collaborative efforts of
    multiple community translators contributing to the project, the localization problems are now
    being addressed one by one, steadily and continuously. It's safe to say that BALV remains pretty
    useless at this point, but we still believe that:
  </p>
  <p>
    <strong
      >Only when everyone can correct the localization, can the localization errors be finally
      elimated.</strong
    >
    It's a long and collaborative joint effort, and BALV is here for help, firmly standing with
    everyone out here.
  </p>
  <p>It's a natural thing to have a proper localization, not a privilege.</p>
</template>
