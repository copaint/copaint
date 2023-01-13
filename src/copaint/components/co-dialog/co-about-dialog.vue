<template>
  <CoDialog title="关于「像素小画家」" v-bind="$attrs" @confirm="$emit('update:visible', false)" cancel-btn-text="关闭"
    hide-confirm-btn>
    <div class="text-sm">
      <p>「像素小画家」是一款在线像素画绘制应用。<br>目前正在开发中，敬请期待……</p>
      <p class="mt-4">版权所有 柯灰©️2022</p>
    </div>
  </CoDialog>
</template>
<script lang="ts" setup>
import CoDialog from '.';
</script>
