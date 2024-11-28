<script setup lang="ts">
import type { Component } from 'vue'
import { useSetting } from '@/stores/setting'
import type { SiteUiLang } from '@/tool/Constant';
import WhyBalvViewCompEn from '@/components/views/WhyBalvViewCompEn.vue';
import WhyBalvViewCompZhCn from '@/components/views/WhyBalvViewCompZhCn.vue';
import WhyBalvViewCompZhTw from '@/components/views/WhyBalvViewCompZhTw.vue';

const allComps: Record<SiteUiLang, Component> = {
  en: WhyBalvViewCompEn,
  zh_CN: WhyBalvViewCompZhCn,
  zh_TW: WhyBalvViewCompZhTw
}

const setting = useSetting()

</script>

<template>
  <component :is="allComps[setting.ui_lang]" />
</template>

<style scoped>

</style>