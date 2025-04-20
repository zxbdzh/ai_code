import { ref, watch } from 'vue';
import { usePreferredDark } from '@vueuse/core';
import type { ThemeMode } from '../types';

export function useTheme() {
  // 系统暗色模式偏好
  const preferredDark = usePreferredDark();
  
  // 当前主题模式
  const themeMode = ref<ThemeMode>('auto');
  
  // 实际应用的主题（light或dark）
  const currentTheme = ref<'light' | 'dark'>('light');
  
  // 初始化主题
  const initTheme = () => {
    // 尝试从本地存储获取用户设置的主题模式
    const savedMode = localStorage.getItem('theme-mode') as ThemeMode | null;
    if (savedMode) {
      themeMode.value = savedMode;
    }
    
    // 应用主题
    applyTheme();
  };
  
  // 应用主题
  const applyTheme = () => {
    let isDark = false;
    
    // 根据主题模式决定是否使用暗色主题
    if (themeMode.value === 'auto') {
      isDark = preferredDark.value;
    } else {
      isDark = themeMode.value === 'dark';
    }
    
    // 更新当前主题
    currentTheme.value = isDark ? 'dark' : 'light';
    
    // 应用到文档根元素
    document.documentElement.classList.toggle('dark', isDark);
    
    // 设置CSS变量
    document.documentElement.setAttribute('data-theme', currentTheme.value);
  };
  
  // 切换主题模式
  const setThemeMode = (mode: ThemeMode) => {
    themeMode.value = mode;
    localStorage.setItem('theme-mode', mode);
    applyTheme();
  };
  
  // 监听系统主题变化
  watch(preferredDark, () => {
    if (themeMode.value === 'auto') {
      applyTheme();
    }
  });
  
  // 初始化
  initTheme();
  
  return {
    themeMode,
    currentTheme,
    setThemeMode,
  };
}