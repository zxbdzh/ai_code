<script setup lang="ts">
import { useTheme } from '../composables/useTheme';
import { useClickEffect } from '../composables/useClickEffect';
import type { ThemeMode } from '../types';

// 使用主题钩子
const { themeMode, setThemeMode } = useTheme();
// 使用点击特效钩子
const { isEnabled, toggle } = useClickEffect();

// 主题选项
const themeOptions = [
  { value: 'auto', label: '自动', icon: '🌓' },
  { value: 'light', label: '亮色', icon: '☀️' },
  { value: 'dark', label: '暗色', icon: '🌙' }
];

// 切换主题
const changeTheme = (mode: ThemeMode) => {
  setThemeMode(mode);
};
</script>

<template>
  <div class="theme-switcher">
    <div class="theme-options">
      <button 
        v-for="option in themeOptions" 
        :key="option.value"
        class="theme-option"
        :class="{ active: themeMode === option.value }"
        @click="changeTheme(option.value as ThemeMode)"
      >
        <span class="theme-icon">{{ option.icon }}</span>
        <span class="theme-label">{{ option.label }}</span>
      </button>
      <button
        class="theme-option"
        :class="{ active: isEnabled }"
        @click="toggle"
      >
        <span class="theme-icon">✨</span>
        <span class="theme-label">{{ isEnabled ? '关闭' : '开启' }}特效</span>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.theme-switcher {
  margin: 10px 0;
  
  .theme-options {
    display: flex;
    background-color: var(--bg-element);
    border-radius: 8px;
    padding: 4px;
    width: fit-content;
  }
  
  .theme-option {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border: none;
    background: transparent;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: var(--text-primary);
    
    &:hover {
      background-color: rgba(var(--primary-color-rgb), 0.1);
    }
    
    &.active {
      background-color: var(--primary-color);
      color: white;
    }
    
    .theme-icon {
      margin-right: 6px;
      font-size: 16px;
    }
    
    .theme-label {
      font-size: 14px;
      font-weight: 500;
    }
  }
}
</style>