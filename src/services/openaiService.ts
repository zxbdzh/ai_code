import { AIService } from './aiService';
import type { OpenAIResponse, CodeGenerationConfig } from '../types';

// OpenAI API服务
export class OpenAIService extends AIService {
  private baseURL: string = 'https://api.openai.com/v1';
  
  // 生成代码的方法
  async generateCode(config: CodeGenerationConfig, onProgress?: (text: string) => void): Promise<string> {
    try {
      // 如果提供了自定义API密钥，使用它
      const apiKey = config.apiKey || this.apiKey;
      
      if (!apiKey) {
        throw new Error('API密钥未提供');
      }
      
      // 构建提示词
      const fullPrompt = `
        请直接生成一个完整的${config.gameType}游戏HTML文件，不需要解释代码。
        具体要求如下：
        ${config.prompt}
        
        技术要求：
        1. 生成一个完整的HTML文件，包含所有必要的CSS和JavaScript代码
        2. 确保代码可以直接在浏览器中运行，不依赖任何外部文件或CDN
        3. 代码需要清晰易读，包含适当的注释
        4. 使用现代ES6+语法
        5. 确保游戏具有响应式设计
        ${config.gameType === 'Flappy Bird' ? '6. 游戏速度必须适中，不要太快，确保玩家有足够的反应时间' : ''}
        ${config.customIcon ? `${config.gameType === 'Flappy Bird' ? '7' : '6'}. 使用以下图标：${config.customIcon}` : ''}
        
        在HTML底部添加简短的游戏说明，不要在回复中添加任何其他解释性文本。
        直接输出完整的HTML代码，不要有任何前缀或后缀说明。
      `.trim();
      
      // 使用流式响应来展示代码生成过程
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: '你是一个专业的游戏开发助手，精通HTML5游戏开发。只输出完整的HTML代码，不要有任何解释性文本。代码应当可以直接运行，并在底部包含简短的游戏说明。同时语言为中文，代码中包含中文注释。不能有游戏分辨率超过容器等问题。'
            },
            {
              role: 'user',
              content: fullPrompt
            }
          ],
          stream: true,
          temperature: 0.8,
          max_tokens: 4000,
          presence_penalty: 0.2,
          frequency_penalty: 0.3
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        const errorMessage = error.error?.message || '未知错误';
        console.error('OpenAI API错误:', error);
        throw new Error(`API请求失败: ${errorMessage}。请检查API密钥是否正确，或稍后重试。`);
      }
      
      // 处理流式响应
      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      let generatedCode = '';
      
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(line => line.trim() !== '');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.substring(6);
              if (data === '[DONE]') continue;
              
              try {
                const json = JSON.parse(data) as OpenAIResponse;
                const content = json.choices[0]?.delta?.content || '';
                
                if (content) {
                  generatedCode += content;
                  if (onProgress) {
                    onProgress(generatedCode);
                  }
                }
              } catch (e) {
                console.error('解析响应失败:', e);
              }
            }
          }
        }
      }
      
      return generatedCode;
    } catch (error) {
      console.error('生成代码时出错:', error);
      throw error;
    }
  }
  
  // 创建HTML文件下载链接
  createDownloadLink(htmlContent: string): string {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    return URL.createObjectURL(blob);
  }
}

// 导出单例实例
export const openaiService = new OpenAIService();