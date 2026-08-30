# AI代码生成器

[English](README.en.md)

一个基于Vue 3 + TypeScript + Vite的智能代码生成工具，专门用于生成HTML5游戏。支持多种AI模型，提供丰富的游戏预设和自定义配置选项。

## ✨ 特性

- 🎮 **多种游戏预设** - 内置贪吃蛇、2048、俄罗斯方块、Flappy Bird等经典游戏模板
- 🤖 **多AI模型支持** - 支持OpenAI GPT和Deepseek等多种AI服务
- ⚙️ **灵活配置** - 每个游戏预设都有可自定义的配置选项
- 🎨 **主题切换** - 支持亮色/暗色主题切换
- 📱 **响应式设计** - 适配桌面和移动设备
- ⚡ **实时预览** - 生成代码后可立即预览效果
- 💾 **代码下载** - 支持将生成的HTML游戏下载到本地
- 🌈 **语法高亮** - 代码显示支持语法高亮
- 🎯 **打字动画** - 代码生成过程带有流畅的打字动画效果

## 🛠️ 技术栈

- **前端框架**: Vue 3 (Composition API)
- **类型系统**: TypeScript
- **构建工具**: Vite
- **样式预处理**: SCSS
- **HTTP客户端**: Axios
- **代码高亮**: Highlight.js
- **文件下载**: File-saver
- **工具库**: @vueuse/core

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- pnpm >= 8.0.0 (推荐) 或 npm >= 8.0.0

### 安装依赖

```bash
# 使用pnpm (推荐)
pnpm install

# 或使用npm
npm install
```

### 开发模式

```bash
# 启动开发服务器
pnpm dev

# 或使用npm
npm run dev
```

### 构建生产版本

```bash
# 构建生产版本
pnpm build

# 或使用npm
npm run build
```

### 预览生产版本

```bash
# 预览构建结果
pnpm preview

# 或使用npm
npm run preview
```

## 📖 使用指南

### 1. 配置AI服务

1. 在"大模型配置"面板中选择AI模型（OpenAI或Deepseek）
2. 输入对应的API密钥
3. API密钥会自动保存到本地存储中

### 2. 选择游戏类型

- 从预设的游戏类型中选择一个（贪吃蛇、2048、俄罗斯方块、Flappy Bird）
- 或选择"自定义游戏"来创建自己的游戏

### 3. 自定义配置

根据选择的游戏类型，可以配置以下选项：
- 控制方式（方向键、WASD等）
- 游戏难度参数
- 网格大小
- 得分规则等

### 4. 生成代码

点击"生成代码"按钮，AI将根据您的配置生成完整的HTML5游戏代码。

### 5. 预览和下载

- 生成完成后可以实时预览游戏效果
- 点击"下载HTML"按钮将游戏保存到本地

## 🎯 支持的游戏类型

### 🐍 贪吃蛇
- 经典的贪吃蛇游戏
- 可配置控制方式和增长长度
- 支持方向键和WASD控制

### 🔢 2048
- 数字合成益智游戏
- 可配置网格大小（3x3、4x4、5x5）
- 可自定义新方块生成规则

### 🧱 俄罗斯方块
- 经典的俄罗斯方块游戏
- 可配置控制方式和得分规则
- 支持多种方块形状

### 🐦 Flappy Bird
- 飞行躲避游戏
- 可配置控制方式和飞行速度
- 支持多种难度级别

### 🎯 自定义游戏
- 完全自定义的游戏类型
- 自由描述游戏规则和玩法
- AI根据描述生成对应游戏

## 🔧 项目结构

```
src/
├── components/          # Vue组件
│   ├── CodeGenerator.vue    # 主要的代码生成组件
│   └── ThemeSwitcher.vue    # 主题切换组件
├── composables/         # Vue组合式函数
│   ├── useClickEffect.ts    # 点击效果
│   └── useTheme.ts          # 主题管理
├── data/               # 数据文件
│   └── gamePresets.ts       # 游戏预设配置
├── services/           # 服务层
│   ├── aiService.ts         # AI服务基类和工厂
│   ├── deepseekService.ts   # Deepseek AI服务
│   └── openaiService.ts     # OpenAI服务
├── types/              # TypeScript类型定义
│   └── index.ts             # 主要类型定义
├── App.vue             # 根组件
├── main.ts             # 应用入口
└── style.css           # 全局样式
```

## 🔌 API配置

### OpenAI配置
```typescript
{
  type: 'openai',
  name: 'OpenAI',
  baseURL: 'https://api.openai.com/v1',
  defaultModel: 'gpt-3.5-turbo'
}
```

### Deepseek配置
```typescript
{
  type: 'deepseek',
  name: 'Deepseek',
  baseURL: 'https://api.deepseek.com/v1',
  defaultModel: 'deepseek-chat'
}
```

## 🎨 主题系统

项目支持亮色和暗色两种主题：

- **亮色主题**: 清爽的白色背景，适合白天使用
- **暗色主题**: 护眼的深色背景，适合夜间使用

主题切换会自动保存到本地存储，下次访问时会记住您的选择。

## 🌟 核心功能

### AI代码生成
- 支持流式输出，实时显示生成进度
- 智能的代码格式化和优化
- 支持自定义提示词和参数替换

### 代码预览
- 内置iframe预览窗口
- 实时渲染生成的HTML游戏
- 支持全屏预览模式

### 代码管理
- 语法高亮显示
- 支持代码折叠和展开
- 一键下载生成的HTML文件

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进这个项目！

### 开发流程
1. Fork本项目
2. 创建功能分支: `git checkout -b feature/amazing-feature`
3. 提交更改: `git commit -m 'Add some amazing feature'`
4. 推送分支: `git push origin feature/amazing-feature`
5. 提交Pull Request

### 代码规范
- 使用TypeScript进行类型检查
- 遵循Vue 3 Composition API最佳实践
- 使用SCSS编写样式
- 保持代码简洁和可读性

## 📄 许可证

本项目采用MIT许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Vue.js](https://vuejs.org/) - 渐进式JavaScript框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [TypeScript](https://www.typescriptlang.org/) - JavaScript的超集
- [Highlight.js](https://highlightjs.org/) - 语法高亮库
- [@vueuse/core](https://vueuse.org/) - Vue组合式函数工具集

## 📞 联系方式

如果您有任何问题或建议，欢迎通过以下方式联系：

- 提交Issue: [GitHub Issues](https://github.com/your-username/ai-code/issues)
- 邮箱: your-email@example.com

---

⭐ 如果这个项目对您有帮助，请给它一个星标！
