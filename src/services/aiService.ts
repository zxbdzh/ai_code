import type { CodeGenerationConfig } from '../types';

// AI服务基类
export abstract class AIService {
  protected apiKey: string = '';
  
  constructor(apiKey?: string) {
    if (apiKey) this.apiKey = apiKey;
  }
  
  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  abstract generateCode(config: CodeGenerationConfig, onProgress?: (text: string) => void): Promise<string>;
}

// AI模型类型
export type AIModelType = 'openai' | 'deepseek';

// AI模型配置
export interface AIModelConfig {
  type: AIModelType;
  name: string;
  baseURL: string;
  defaultModel: string;
}

// 支持的AI模型配置
export const AI_MODELS: AIModelConfig[] = [
  {
    type: 'openai',
    name: 'OpenAI',
    baseURL: 'https://api.openai.com/v1',
    defaultModel: 'gpt-3.5-turbo'
  },
  {
    type: 'deepseek',
    name: 'Deepseek',
    baseURL: 'https://api.deepseek.com/v1',
    defaultModel: 'deepseek-chat'
  }
];

// AI服务工厂
export class AIServiceFactory {
  static async createService(type: AIModelType, apiKey?: string): Promise<AIService> {
    switch (type) {
      case 'openai':
        const { OpenAIService } = await import('./openaiService');
        return new OpenAIService(apiKey);
      case 'deepseek':
        const { DeepseekService } = await import('./deepseekService');
        return new DeepseekService(apiKey);
      default:
        throw new Error(`不支持的AI模型类型: ${type}`);
    }
  }
}