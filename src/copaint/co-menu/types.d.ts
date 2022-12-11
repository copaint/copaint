import type { Component } from 'vue';

export type MenuSubItem = {
  label: string;
  code: string;
  icon?: Component;
  onClick?: () => void;
};

export type MenuItem = {
  label: string;
  children?: MenuSubItem[];
};
