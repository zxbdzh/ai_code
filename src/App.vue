<script setup lang="ts">
import CodeGenerator from './components/CodeGenerator.vue'
import ThemeSwitcher from './components/ThemeSwitcher.vue'
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <div class="app-logo">
        <img src="./assets/vue.svg" class="logo" alt="Vue logo" />
        <h1>AI代码生成器</h1>
      </div>
      <ThemeSwitcher />
    </header>
    
    <main class="app-content">
      <CodeGenerator />
    </main>
    
    <footer class="app-footer">
      <p>© 2025 AI代码生成器 - 基于Vue3 + Vite + TypeScript</p>
    </footer>
  </div>
</template>

<style lang="scss">
:root {
  /* 亮色主题变量 */
  --primary-color: #646cff;
  --primary-color-rgb: 100, 108, 255;
  --bg-primary: #ffffff;
  --bg-element: #f5f5f5;
  --text-primary: #213547;
  --text-secondary: #4a5568;
  --border-color: #e2e8f0;
}

/* 暗色主题变量 */
[data-theme="dark"] {
  --primary-color: #818cf8;
  --primary-color-rgb: 129, 140, 248;
  --bg-primary: #1a1a1a;
  --bg-element: #2a2a2a;
  --text-primary: rgba(255, 255, 255, 0.87);
  --text-secondary: #a0aec0;
  --border-color: #4a5568;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  margin: 0;
  padding: 0;
  min-height: 100vh;
  transition: background-color 0.3s, color 0.3s;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  border-bottom: 1px solid var(--border-color);
  
  .app-logo {
    display: flex;
    align-items: center;
    
    .logo {
      height: 2.5rem;
      margin-right: 1rem;
    }
    
    h1 {
      font-size: 1.5rem;
      margin: 0;
      color: var(--primary-color);
    }
  }
}

.app-content {
  flex: 1;
  padding: 2rem;
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
}

.app-footer {
  text-align: center;
  padding: 1rem;
  border-top: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-size: 0.875rem;
}
</style>
