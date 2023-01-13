import type { InjectionKey } from 'vue';

export const ProvideVisibleKey: InjectionKey<(v: boolean) => void> = Symbol();

export const useProvideVisible = () => {
  const count = ref(0);
  provide(ProvideVisibleKey, (visible) => {
    count.value += visible ? 1 : -1;
  });
  const submenuVisible = computed(() => count.value > 0);

  return {
    submenuVisible,
  };
};

export const useInjectVisible = () => {
  return inject(ProvideVisibleKey, () => {});
};
