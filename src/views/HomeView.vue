<script setup lang="ts">
import { computed, watch } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { MOBILE_WIDTH } from '@/tool/Constant'
import { useI18n } from 'vue-i18n'

const screenWidth = useWindowSize().width
const isMobileWidth = computed(() => MOBILE_WIDTH >= screenWidth.value)

const cssFlexRowForDiv1 = computed(() => !isMobileWidth.value ? 2 : 1)

const { t } = useI18n()
</script>

<template>
  <div :style="isMobileWidth? '' :'display: flex'">
    <div class="home-bulletin-div-group-1">
      <div class="home-bulletin-div">
        <h1>{{ $t('home-h1-1') }}</h1>
        <p v-html="t('home-p-1')"></p>
        <p v-html="t('home-p-2')"></p>
        <p v-html="t('home-p-3')"></p>
        <h1>{{ $t('home-h1-2') }}</h1>
        <p v-html="t('home-p-4')"></p>
      </div>
    </div>
    <div style="flex: 1">
      <div class="home-bulletin-div">
        <h2>AWS CDN Info</h2>
        <p>For <b>users in China Mainland</b>, you can visit the AWS-accelerated site at <a
          href="https://ba-l10n-aws.cnfast.top/">https://ba-l10n-aws.cnfast.top/</a> for better experience.</p>
        <p><b>中国大陆地区用户</b>可访问本站的AWS加速版（<a href="https://ba-l10n-aws.cnfast.top/">https://ba-l10n-aws.cnfast.top/</a>）以获得更好体验。
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-bulletin-div {
  /* Modified from https://hina.loves.midokuni.com/ */
  padding: 10px;
  margin: 10px;
  border: 1px solid var(--color-ba-logo);
  border-radius: 10px;
}

.home-bulletin-div-group-1 {
  flex: v-bind(cssFlexRowForDiv1)
}
</style>
