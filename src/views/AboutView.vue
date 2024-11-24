<script setup lang="ts">
import type { Component } from 'vue'
import { useSetting } from '@/stores/setting'
import type { SiteUiLang } from '@/tool/Constant';
import AboutViewCompEn from '@/components/views/AboutViewCompEn.vue';
import AboutViewCompZhCn from '@/components/views/AboutViewCompZhCn.vue';
import AboutViewCompZhTw from '@/components/views/AboutViewCompZhTw.vue';

const allComps: Record<SiteUiLang, Component> = {
  en: AboutViewCompEn,
  zh_CN: AboutViewCompZhCn,
  zh_TW: AboutViewCompZhTw
}

const setting = useSetting()
</script>

<template>
  <component :is="allComps[setting.ui_lang]" />
</template>

<style>
</style>