<script setup lang="ts">
import type { Component } from 'vue'
import { useSetting } from '@/stores/setting'
import type { SiteUiLang } from '@/tool/Constant';
import FaqViewCompEn from '@/components/views/FaqViewCompEn.vue';
import FaqViewCompZhCn from '@/components/views/FaqViewCompZhCn.vue';
import FaqViewCompZhTw from '@/components/views/FaqViewCompZhTw.vue';

const allComps: Record<SiteUiLang, Component> = {
  en: FaqViewCompEn,
  zh_CN: FaqViewCompZhCn,
  zh_TW: FaqViewCompZhTw
}

const setting = useSetting()

</script>

<template>
  <component :is="allComps[setting.ui_lang]" />
</template>

<style scoped>

</style>