// 定义类型接口

// 主题模式类型
export type ThemeMode = 'auto' | 'light' | 'dark';

// OpenAI API响应类型
export interface OpenAIResponse {
  id: string;
  choices: {
    text?: string;
    message?: {
      content: string;
    };
    delta?: {
      content?: string;
    };
    index: number;
  }[];
  created: number;
}

// 代码生成配置类型
export interface CodeGenerationConfig {
  prompt: string;
  gameType: string;
  customIcon?: string;
  apiKey?: string;
}

// 预设游戏类型
export interface GamePreset {
  id: string;
  name: string;
  description: string;
  prompt: string;
  icon?: string;
  configOptions?: GameConfigOption[];
}

export interface GameConfigOption {
  id: string;
  label: string;
  type: 'select' | 'number' | 'checkbox';
  defaultValue: string | number | boolean;
  options?: {value: string | number | boolean; label: string}[];
  placeholder?: string;
}

// 生成的代码结果
export interface GeneratedCode {
  code: string;
  html: string;
  downloadUrl?: string;
}