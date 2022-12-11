<template>
  <li class="h-full flex items-center px-3 text-white/60 hover:text-white/80 select-none"
    :class="{ 'bg-dark-50': popoverVisible }" ref="btnEl" @click="handleClickBtn">
    <span class="text-sm">{{ item.label }}</span>
  </li>
  <!-- popover -->
  <teleport to="body" v-if="item.children?.length">
    <div class="fixed w-48 shadow bg-dark-50" :style="popoverStyle" v-show="popoverVisible">
      <ul>
        <li class="flex items-center px-4 py-2 text-sm text-white/60 select-none hover:bg-white/10"
          @click="handleItemClick(it)" v-for="it in item.children" :key="it.code">
          <component :is="it.icon" v-if="it.icon" class="mr-2" />
          <span>{{ it.label }}</span>
        </li>
      </ul>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { onClickOutside } from '@vueuse/core'
import { MenuItem, MenuSubItem } from './types';

defineProps<{
  item: MenuItem;
}>();

const emits = defineEmits<{
  (event: 'item-click', code: MenuSubItem['code']): void;
}>()

const popoverVisible = ref(false);

const btnEl = ref<HTMLLIElement>();

onClickOutside(btnEl, (event) => {
  if (popoverVisible.value) {
    popoverVisible.value = false;
  }
})

const popoverStyle = computed(() => {
  if (!btnEl.value) return {};
  const { left, top, height } = btnEl.value.getBoundingClientRect();
  return {
    left: `${left}px`,
    top: `${top + height - 1}px`,
  };
});

const handleClickBtn = () => {
  popoverVisible.value = !popoverVisible.value;
};

const handleItemClick = (item: MenuSubItem) => {
  item.onClick?.();
  emits('item-click', item.code);
};
</script>
