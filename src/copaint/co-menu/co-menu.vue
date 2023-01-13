<template>
  <ul class="h-full inline-flex" v-on-click-outside="handleClickOutside">
    <VfMenuItem v-for="item in menu" :key="item.label" :item="item" :popover-visible="activeKey === item.key"
      @menu-click="handleMenuClick" @menu-mouseenter="handleMenuMouseenter" />
  </ul>
</template>

<script lang="ts" setup>
import { vOnClickOutside } from '@vueuse/components'
import VfMenuItem from './co-menu-item.vue';
import { MenuItem } from './types';
import FaRegularFile from '~icons/fa-regular/file'
import FaRegularSave from '~icons/fa-regular/save'
import FaRegularSmile from '~icons/fa-regular/smile'
import CarbonAdd from '~icons/carbon/add'
import CarbonSubtract from '~icons/carbon/subtract'
import CarbonFitToScreen from '~icons/carbon/fit-to-screen'
import CarbonScreen from '~icons/carbon/screen'
import { useCopaintStore } from '../store';
import { useProvideVisible } from './uses';

const { canvasFullToScreen } = useCopaintStore();
const { settings, dialogVisible, canvasEl, isMounted, canvasInfo } = storeToRefs(useCopaintStore());

const menu: MenuItem[] = [
  {
    label: '文件(F)',
    key: 'FILE',
    children: [
      {
        label: '新建画布',
        code: 'NEW',
        icon: FaRegularFile,
        onClick: () => {
          dialogVisible.value.newFile = true;
        },
      },
      {
        label: '导出',
        code: 'EXPORT',
        icon: FaRegularSave,
      }
    ]
  },
  // {
  //   label: '编辑(E)',
  //   children: [
  //     {
  //       label: '重做',
  //       code: 'REDO',
  //     },
  //     {
  //       label: '撤销',
  //       code: 'EXPORT',
  //     }
  //   ]
  // },
  // { label: '选择(S)' },
  {
    label: '查看(V)',
    key: 'VIEW',
    children: [
      {
        label: '放大',
        code: 'VIEW_UP',
        icon: CarbonAdd,
        onClick: () => {
          settings.value.view.scale += 4;
        },
      },
      {
        label: '缩小',
        code: 'VIEW_DOWN',
        icon: CarbonSubtract,
        onClick: () => {
          settings.value.view.scale -= 4;
        },
      },
      {
        label: '100%',
        code: 'VIEW1',
        icon: CarbonScreen,
        onClick: () => {
          settings.value.view.scale = 1;
        },
      },
      {
        label: '适应窗口',
        code: 'VIEW_AUTO',
        icon: CarbonFitToScreen,
        onClick: () => {
          canvasFullToScreen();
        },
      },
    ]
  },
  {
    label: '帮助(H)',
    key: 'HELP',
    children: [
      {
        label: '关于',
        code: 'ABOUT',
        icon: FaRegularSmile,
        onClick: () => {
          dialogVisible.value.about = true;
        },
      }
    ]
  },
];

const activeKey = ref<string>();

const handleMenuClick = (key: string) => {
  activeKey.value = activeKey.value === key ? undefined : key;
};
const handleMenuMouseenter = (key: string) => {
  if (activeKey.value) {
    activeKey.value = key;
  }
};

const handleClickOutside = () => {
  activeKey.value = undefined;
};
</script>
