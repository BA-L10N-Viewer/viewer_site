<template>
  <h1>为什么有这个项目</h1>

  <h2>BALV的前前前世</h2>
  <p>
    最初有类似BALV的想法要追溯到2023年6月。彼时的我开了小号，打算一边美服备战二周年一边看英文剧情积累词汇。相较于繁中，英文版不仅大改句子变得简洁不少，而且还用了很多专业与比较生僻的词，读起来很吃力。于是当时我就想，如果有工具能两边对照着看就好了。
  </p>
  <p>
    由于当时没接触到解包，加上当时也不关心（和没意识到）BA的文本对错与质量，这个想法最后被搁置了。不过主要还是因为当时我很喜欢BA的音乐，于是整了一个叫BA
    OST
    Index的项目，基于Jinja的静态网站——但因为后续维护与功能更新体量过大，我个人也就逐渐不再维护了。
  </p>
  <p>
    入坑几个月的时候，我是觉得繁中翻译没什么问题的，不过在经历了相当多的一些译法争讨论后，我开始改变看法。2024年5月，百鬼夜行主线实装，在推特上，英文区的用户首次罕见的联合起来，把Nexon的本地化团队吊着打，之后也一直如此，直到现在。由于BA
    OST Index我已无心维护，所以BALV的这个想法自然就又回到了我的思绪里。
  </p>
  <p>
    2024年6月，我开始着手BALV的前期开发准备工作，确认功能及架构等。7月～8月，BALV进入基础功能开发。9月，BALV正式上线beta版。目前，BALV正在进行UI重构及新功能的添加，为用户提供更好体验。
  </p>

  <h2>逆天的本地化文本</h2>
  <p>
    相较于上文中提到的英文区，作为母语为中文的我们简直可谓为活在天堂。至少在翻译上，剧情上我们有威威字幕君等团队和个人，二创也有无数烤肉组与单干的散户，而且质量都很不错；应当说，BA有一个这样的社区是我们中文区玩家的福气。根据我观察的来看，英文区这边虽确实也有几位扛把子的，但似乎都是单干，少见有团队气候。
  </p>
  <p>
    国服简中与国际服繁中的情况这里就不多介绍了，总结来说就是一个是和谐，一个是翻译“还算可以”的地步。据说繁中还是经过几次大概并切到了日语为原文翻译的，只能说很幸运了。
  </p>
  <p>
    英文区其实一直以来都被NX的本地化搞得很不爽，因为除了明显的翻译错误外，英文区翻译还加入了些许Reddit俚语烂梗，甚至不明所以地改掉一大段句子（尤见于部分大厅语音，特别是对老师有明显表白、性暗示的）或加一些完全子虚乌有的东西。自2024年5月国际服百鬼夜行主线实装以来，部分日、韩玩家就一直与英文区玩家联手，不仅将其中的翻译一一指出并做成一图流等形式方便传播，还号召广大玩家去英文区官号底下留言并冲塔Nexon的客服中心，最终让许多翻译问题得到了解决与修正。
  </p>
  <p>
    BALV与其他存在或仍在开发的游戏内文本查看器不同，它于一开始就对多语言文本的对比与机翻翻译作了特别支持，这一方面是为了满足像我这种语言学习者和好奇宝宝，另一方面也是为了帮助以上这种特殊的情况，使人人都可参与其中并简化对比流程。
  </p>

  <PvMessage severity="info"
    >不过，值得指出的是，最近（11月底）推特用户<a href="https://x.com/TL2TJ">TL2TJ</a
    >在网上发布了自己的一个针对国际版的小Mod，其针对性的修改了游戏内的本地化内容数据库，并且目前已获得多个社区翻译及逆向大佬的帮助。<br />
    所以……可以说BALV刚一出场就输了吧，不过我们的另一点初心却并没有改变：那就是，为全部BA玩家提供一个快速、简单、便捷的游戏内文本查看服务。<br />
    总而言之，希望你阅读愉快！</PvMessage
  >

  <h2>日、韩文本之争</h2>
  <p>
    众所周知，BA是一款由韩国NEXON
    Games开发的游戏。而又众所周知的是，日服因为比国际服先开，所以日服比国际服进度要快。还众所周知的是，日方运营Yostar会对文本进行润色。
  </p>
  <p>
    以上事实体现出三点情况：一，游戏的原始语言是韩文；二，日服内容会成为玩家重要的一手资源，甚至会成为玩家认可的“唯一官方版本”；三，韩、日文文本并不完全一致。
  </p>
  <p>看上去没什么问题，对吧？</p>
  <p>
    大错特错。如果你关注一些做BA剧情解析的UP主，那么底下评论区里提到日韩文文本之间异同的评论应该你也见多了。照理来说，因为日服在前，因此国际服理应最好对照日语来翻——你大概已经猜出来了：没错！除了繁中外，目前英、泰文其实都是按韩文来翻译的！
  </p>
  <p>
    这种源语言的差异会导致一些很抽象的问题。在一开始的时候，大家都是参照的日服文本，结果就导致了有很多对不上的；后来，有懂韩文的老哥表示，这其中很多所谓的“翻译问题”纯粹是因为对的是日文，从韩文的角度看并没有太大问题。
  </p>
  <p>
    由于日、韩文之间的明显差异，有一些玩家也认为国服简中翻译是基于韩文文本翻译的，这点我无法确认。
  </p>
  <p>
    造成日、韩文文本差异的原因很简单：语言与文化差异。从结果看，BA日服在翻译时采用了“异化翻译”，即将文本改为更符合当地语言习惯和认知的形式，并且还对译文进行了修改与润色（并可能同时部分拯救了V1C3中星野的形象）。虽说也是改，但至少不是像英文区那样离经叛道和瞎鸡儿乱改，不过就算这样也足以造成两个文本之间的差异。
  </p>

  <h2>现在，又如何呢？</h2>
  <p>
    对于中文区的玩家来说，BA国服简中和国际服繁中的本地化已经够用，再不济还有一整个社区兜底呢，因而无需也没有必要去冲Nexon，毕竟人不多Nexon也不会重视。而且考虑到Nexon特意为了迎合市场，把繁中都专门切到日文翻了，只能说是给足面子了。
  </p>
  <p>
    对于英文区的玩家来说，我的评价是务必加大力度。作为玩家，也作为一个业余的半吊子中英翻译，我认为让全体玩家享受原汁原味、极少量或不妥协的本地化内容是每个本地化团队的任务与使命。对于Nexon这种不放在心上、不投入足量资金的行为，我个人表示不认可与谴责。
  </p>
  <p>
    不过，如今逼迫官方做出改动或许也不是必要的了。由于推特上的<a href="https://x.com/TL2TJ">TL2TJ</a
    >大佬的贡献及社区翻译人的加入，BA英文区的本地化问题正逐渐通过Mod（覆盖游戏原文件）的形式逐步改善和消除。可以说本站的作用因此已不再那么显著，但我们仍然在这里表明态度：
  </p>
  <p>
    <strong>唯当人人都可参与纠错的过程中时，本地化中的问题才能被一一解决</strong
    >——BALV为此而来，也为此而努力。
  </p>
</template>

<script setup lang="ts">
import PvMessage from 'primevue/message'
</script>
