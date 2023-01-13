<template>
  <teleport to="body">
    <div class="fixed inset-0 bg-white/0" v-show="visible">
      <div class="absolute left-1/2 top-1/2 w-96 transform -translate-x-1/2 -translate-y-1/2 shadow-lg bg-white">
        <div class="flex justify-between items-center h-10 bg-dark-200 text-white/60 select-none">
          <div class="pl-4">{{ title }}</div>
          <button class="flex justify-center items-center w-10 h-10 hover:bg-red-500" @click="handleClose">
            <CarbonClose />
          </button>
        </div>
        <div class="p-4 bg-dark-50 text-white/80">
          <slot />
        </div>
        <div class="flex justify-end items-center p-4 bg-dark-50">
          <button class="h-8 px-5 text-sm border border-white/20 text-white/80" v-if="!hideCancelBtn"
            @click="handleClose">{{ cancelBtnText || '取消' }}</button>
          <button class="ml-4 h-8 px-5 text-sm border border-white/80 text-white/80 focus:border-blue-500" v-if="!hideConfirmBtn"
            @click="handleConfirm">{{ confirmBtnText || '确定' }}</button>
        </div>
      </div>
    </div>
  </teleport>
</template>
<script lang="ts" setup>
import CarbonClose from '~icons/carbon/close'

defineProps<{
  title?: string;
  visible?: boolean;
  hideCancelBtn?: boolean;
  hideConfirmBtn?: boolean;
  cancelBtnText?: string;
  confirmBtnText?: string;
}>();

const emits = defineEmits<{
  (event: 'update:visible', value: boolean): void;
  (event: 'confirm'): void;
}>();

const handleClose = () => {
  emits('update:visible', false);
};

const handleConfirm = () => {
  emits('confirm');
};
</script>