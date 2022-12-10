<template>
  <ul class="h-full flex">
    <VfMenuItem v-for="item in menu" :key="item.label" v-bind="item" />
  </ul>
</template>

<script lang="ts" setup>
import VfMenuItem from './co-menu-item.vue';

const menu = [
  { label: '文件(F)' },
  { label: '编辑(E)' },
  { label: '选择(S)' },
  { label: '查看(V)' },
  { label: '帮助(H)' },
];
</script>
