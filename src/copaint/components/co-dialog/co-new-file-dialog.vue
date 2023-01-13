<template>
  <CoDialog title="新建项目" v-bind="$attrs">
    <div class="pr-16">
      <div>
        <label class="flex">
          <span class="flex-1 mr-2 text-right text-sm">宽度:</span>
          <CoInput />
        </label>
        <label class="flex mt-2">
          <span class="flex-1 mr-2 text-right text-sm">高度:</span>
          <CoInput />
        </label>
        <label class="flex mt-4">
          <span class="flex-1 mr-2 text-right text-sm">背景内容:</span>
          <select class="px-1 text-sm border border-white/20 bg-dark-100 outline-none focus:border-blue-500">
            <option value="1">透明</option>
            <!-- <option value="2">白色</option>
            <option value="3">黑色</option> -->
          </select>
        </label>
      </div>
    </div>
  </CoDialog>
</template>
<script lang="ts" setup>
import CoDialog from '.';
import CoInput from '../co-input';
</script>
