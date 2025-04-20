<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { AIServiceFactory, AI_MODELS, type AIModelType } from '../services/aiService';
import { gamePresets } from '../data/gamePresets';
import type { GamePreset, GeneratedCode } from '../types';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import 'highlight.js/styles/atom-one-dark.css';
import { saveAs } from 'file-saver';

// 注册highlight.js语言
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('css', css);

// 状态
const isGenerating = ref(false);
const apiKey = ref('');
const selectedModel = ref<AIModelType>('openai');
const selectedPreset = ref(gamePresets[0]);
const customPrompt = ref('');
const customIcon = ref('');
const configValues = ref<Record<string, string | number | boolean>>({});
const generatedCode = reactive<GeneratedCode>({
    code: '',
    html: ''
});
const showPreview = ref(false);
const previewUrl = ref('');
const generationProgress = ref(0);
const errorMessage = ref('');
const showFullCode = ref(false); // 是否显示完整代码
const isTypingAnimation = ref(false); // 是否正在进行打字动画
const typingInterval = ref<number | null>(null); // 保存打字动画的定时器ID

// 从本地存储加载API密钥
onMounted(() => {
    // 根据选择的模型加载对应的API密钥
    const savedApiKey = localStorage.getItem(`apiKey_${selectedModel.value}`);
    if (savedApiKey) {
        apiKey.value = savedApiKey;
    }
});

// 监听模型变化，加载对应的API密钥
watch(selectedModel, (newModel) => {
    const savedApiKey = localStorage.getItem(`apiKey_${newModel}`);
    if (savedApiKey) {
        apiKey.value = savedApiKey;
    } else {
        apiKey.value = ''; // 如果没有保存过该模型的API密钥，则清空输入框
    }
});

// 选择预设
const selectPreset = (preset: GamePreset) => {
    selectedPreset.value = preset;
    if (preset.id === 'custom') {
        customPrompt.value = '';
    } else {
        customPrompt.value = preset.prompt;
    }
    
    // 重置配置值
    configValues.value = {};
    
    // 初始化配置选项的默认值
    if (preset.configOptions) {
        preset.configOptions.forEach(option => {
            configValues.value[option.id] = option.defaultValue;
        });
    }
};

// 生成代码
const generateCode = async () => {
    try {
        // 保存API密钥到本地存储
        if (apiKey.value) {
            localStorage.setItem(`apiKey_${selectedModel.value}`, apiKey.value);
        }
        
        errorMessage.value = '';
        isGenerating.value = true;
        generatedCode.code = '';
        generatedCode.html = '';
        generationProgress.value = 0;
        showPreview.value = false;

        // 创建AI服务实例
        const aiService = await AIServiceFactory.createService(selectedModel.value, apiKey.value);

        // 准备配置
        let finalPrompt = customPrompt.value || selectedPreset.value.prompt;
        
        // 替换提示词中的配置项占位符
        if (selectedPreset.value.configOptions) {
            selectedPreset.value.configOptions.forEach(option => {
                const value = configValues.value[option.id];
                if (value !== undefined) {
                    finalPrompt = finalPrompt.replace(`{${option.id}}`, value.toString());
                }
            });
        }
        
        const config = {
            prompt: finalPrompt,
            gameType: selectedPreset.value.name,
            customIcon: customIcon.value,
            apiKey: apiKey.value
        };

        // 生成代码，使用回调函数显示生成过程，但限制更新频率以提高性能
        let lastUpdateTime = 0;
        const updateInterval = 500; // 将更新间隔从300ms增加到500ms
        
        // 一旦开始接收到响应，就启动打字动画
        let hasReceivedResponse = false;
        
        const code = await aiService.generateCode(config, (text) => {
            const now = Date.now();
            // 限制更新频率，减少DOM更新，提高性能
            if (now - lastUpdateTime > updateInterval || text.length < 1000) {
                generatedCode.code = text;
                generationProgress.value = Math.min(99, Math.floor((text.length / 3000) * 100));
                lastUpdateTime = now;
                
                // 一旦接收到第一个响应，就启动打字动画
                if (!hasReceivedResponse && text.length > 0) {
                    hasReceivedResponse = true;
                    isTypingAnimation.value = true;
                    simulateTyping();
                }
            }
        });

        generatedCode.code = code;
        generatedCode.html = code;
        generationProgress.value = 100;

        // 创建预览URL
        const blob = new Blob([code], { type: 'text/html' });
        previewUrl.value = URL.createObjectURL(blob);
        generatedCode.downloadUrl = previewUrl.value;

        showPreview.value = true;
    } catch (error: any) {
        errorMessage.value = error.message || '生成代码时出错';
        console.error('生成代码错误:', error);
    } finally {
        isGenerating.value = false;
    }
};

// 下载生成的代码
const downloadCode = () => {
    if (generatedCode.html) {
        const blob = new Blob([generatedCode.html], { type: 'text/html' });
        saveAs(blob, `${selectedPreset.value.name.toLowerCase().replace(/\s+/g, '-')}-game.html`);
    }
};

// 高亮显示代码
const highlightedCode = () => {
    if (!generatedCode.code) return '';
    
    // 如果选择显示完整代码，则显示全部
    if (showFullCode.value) {
        return hljs.highlight(generatedCode.code, { language: 'html' }).value;
    }
    
    // 获取代码的最后部分（最新生成的部分）
    const maxVisibleLength = 2000; // 最大可见代码长度
    const code = generatedCode.code;
    const codeLength = code.length;
    
    // 如果代码长度超过最大可见长度，只显示最后部分
    if (codeLength > maxVisibleLength) {
        const visibleCode = code.substring(codeLength - maxVisibleLength);
        // 尝试从第一个完整的HTML标签开始显示
        const firstTagIndex = visibleCode.indexOf('<');
        const displayCode = firstTagIndex > 0 ? visibleCode.substring(firstTagIndex) : visibleCode;
        return hljs.highlight(displayCode, { language: 'html' }).value;
    }
    
    return hljs.highlight(code, { language: 'html' }).value;
};

// 生成的代码动画效果
const codeAnimation = ref('');
const animationSpeed = ref(50); // 将打字速度从20提升到50

// 跳过打字动画，直接显示完整代码
const skipTypingAnimation = () => {
    if (typingInterval.value !== null) {
        clearInterval(typingInterval.value);
        typingInterval.value = null;
    }
    codeAnimation.value = generatedCode.code;
    isTypingAnimation.value = false;
};

// 模拟打字效果
const simulateTyping = () => {
    if (!generatedCode.code) return;
    
    isTypingAnimation.value = true;
    let currentIndex = 0;
    const getCodeLength = () => generatedCode.code.length;

    if (typingInterval.value !== null) {
        clearInterval(typingInterval.value);
    }

    // 使用requestAnimationFrame代替setInterval来优化性能
    const animate = () => {
        const currentCodeLength = getCodeLength();
        const nextChunkSize = Math.min(animationSpeed.value, currentCodeLength - currentIndex);
        
        if (nextChunkSize <= 0) {
            isTypingAnimation.value = false;
            return;
        }

        codeAnimation.value = generatedCode.code.substring(0, currentIndex + nextChunkSize);
        currentIndex += nextChunkSize;

        if (currentIndex < currentCodeLength) {
            requestAnimationFrame(animate);
        } else {
            isTypingAnimation.value = false;
        }
    };

    requestAnimationFrame(animate);
};

// 监听代码生成完成 - 不再需要，因为我们在接收到第一个响应时就启动动画
// 删除未使用的函数
// const watchCodeGeneration = () => {
//     // 保留此函数以避免引用错误，但不再需要其功能
//     // 现在在接收到第一个响应时就会启动动画
// };

// 组件挂载
onMounted(() => {
    // 初始化
    customPrompt.value = selectedPreset.value.prompt;
    
    // 不再需要监听generationProgress，因为我们在接收到第一个响应时就启动动画了
});
</script>

<template>
    <div class="code-generator">
        <div class="generator-container">
            <!-- 配置面板 -->
            <div class="config-panel">
                <h2>大模型配置</h2>

                <!-- AI模型选择 -->
                <div class="form-group">
                    <label for="ai-model">选择AI模型</label>
                    <select id="ai-model" v-model="selectedModel">
                        <option v-for="model in AI_MODELS" :key="model.type" :value="model.type">{{ model.name }}</option>
                    </select>
                </div>

                <!-- API密钥输入 -->
                <div class="form-group">
                    <label for="api-key">API密钥</label>
                    <input id="api-key" v-model="apiKey" type="password" :placeholder="`输入${AI_MODELS.find(m => m.type === selectedModel)?.name} API密钥`" />
                </div>

                <!-- 游戏预设选择 -->
                <div class="form-group">
                    <label>选择游戏类型</label>
                    <div class="preset-grid">
                        <div v-for="preset in gamePresets" :key="preset.id" class="preset-item"
                            :class="{ active: selectedPreset.id === preset.id }" @click="selectPreset(preset)">
                            <div class="preset-icon">{{ preset.icon }}</div>
                            <div class="preset-name">{{ preset.name }}</div>
                        </div>
                    </div>
                </div>

                <!-- 自定义提示词 -->
                <div class="form-group">
                    <label for="custom-prompt">提示词</label>
                    <textarea id="custom-prompt" v-model="customPrompt" rows="5" placeholder="输入自定义提示词" :disabled="selectedPreset.id !== 'custom'"></textarea>
                </div>

                <!-- 游戏配置选项 -->
                <div class="form-group" v-if="selectedPreset.configOptions && selectedPreset.configOptions.length > 0">
                    <label>游戏配置选项</label>
                    <div class="config-options">
                        <div v-for="option in selectedPreset.configOptions" :key="option.id" class="config-option-item">
                            <label :for="`config-${option.id}`">{{ option.label }}</label>
                            
                            <!-- 选择框类型 -->
                            <select 
                                v-if="option.type === 'select'" 
                                :id="`config-${option.id}`" 
                                v-model="configValues[option.id]"
                            >
                                <!-- 修复选项的key绑定 -->
                                <option 
                                    v-for="opt in option.options" 
                                    :key="String(opt.value)" 
                                    :value="opt.value"
                                >
                                    {{ opt.label }}
                                </option>
                            </select>
                            
                            <!-- 数字输入框类型 -->
                            <input 
                                v-else-if="option.type === 'number'" 
                                :id="`config-${option.id}`" 
                                v-model.number="configValues[option.id]" 
                                type="number" 
                                :placeholder="option.placeholder"
                            />
                            
                            <!-- 复选框类型 -->
                            <div v-else-if="option.type === 'checkbox'" class="checkbox-wrapper">
                                <input 
                                    :id="`config-${option.id}`" 
                                    v-model="configValues[option.id]" 
                                    type="checkbox"
                                />
                                <label :for="`config-${option.id}`">{{ option.placeholder }}</label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 自定义图标 -->
                <div class="form-group" v-if="selectedPreset.id === 'custom'">
                    <label for="custom-icon">自定义图标 (emoji)</label>
                    <input id="custom-icon" v-model="customIcon" type="text" placeholder="输入emoji图标" />
                </div>

                <!-- 生成按钮 -->
                <button class="generate-btn" @click="generateCode" :disabled="isGenerating">
                    {{ isGenerating ? '生成中...' : '生成代码' }}
                </button>

                <!-- 错误信息 -->
                <div class="error-message" v-if="errorMessage">
                    {{ errorMessage }}
                </div>

                <!-- 进度条 -->
                <div class="progress-bar" v-if="isGenerating || generationProgress > 0">
                    <div class="progress-inner" :style="{ width: `${generationProgress}%` }"></div>
                    <span class="progress-text">{{ generationProgress }}%</span>
                </div>
            </div>

            <!-- 代码显示面板 -->
            <div class="code-panel">
                <div class="code-header">
                    <h3>生成的代码</h3>
                    <div class="code-actions" v-if="generatedCode.code">
                        <button @click="downloadCode" class="action-btn download-btn">
                            下载HTML
                        </button>
                        <button @click="showPreview = !showPreview" class="action-btn preview-btn" v-if="previewUrl">
                            {{ showPreview ? '隐藏预览' : '显示预览' }}
                        </button>
                    </div>
                </div>

                <!-- 代码预览 -->
                <div class="code-preview" v-if="showPreview && previewUrl">
                    <iframe :src="previewUrl" frameborder="0"></iframe>
                </div>

                <!-- 代码内容 -->
                <div class="code-content" v-show="!showPreview || !previewUrl">
                    <div class="code-folded-notice" v-if="generatedCode.code && generatedCode.code.length > 2000 && !showFullCode">
                        <p>代码较长，仅显示最新生成的部分...</p>
                        <button @click="showFullCode = true" class="show-full-code-btn">显示所有代码</button>
                    </div>
                    <div class="code-folded-notice" v-if="showFullCode && generatedCode.code && generatedCode.code.length > 2000">
                        <p>显示完整代码</p>
                        <button @click="showFullCode = false" class="show-full-code-btn">仅显示部分代码</button>
                    </div>
                    <div class="skip-animation-notice" v-if="isTypingAnimation && generatedCode.code">
                        <button @click="skipTypingAnimation()" class="skip-animation-btn">跳过动画</button>
                    </div>
                    <pre v-if="generatedCode.code"><code v-html="highlightedCode()"></code></pre>
                    <div class="empty-code" v-else>
                        <p>点击"生成代码"开始创建您的游戏</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.code-generator {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;

    .generator-container {
        display: grid;
        grid-template-columns: 350px 1fr;
        gap: 20px;

        @media (max-width: 768px) {
            grid-template-columns: 1fr;
        }
    }

    .config-panel {
        padding: 20px;
        border-radius: 18px;
        box-shadow: 0 4px 24px 0 rgba(100,108,255,0.08), 0 1.5px 8px 0 rgba(0,0,0,0.06);
        max-width: 100%;
        overflow: hidden;
        backdrop-filter: blur(4px);

        h2 {
            margin-top: 0;
            margin-bottom: 20px;
            font-size: 1.5rem;
            color: var(--text-primary);
        }
    }

    .form-group {
        margin-bottom: 20px;
        width: 100%;

        input,
        textarea,
        select {
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
        }
    }
    
    .config-options {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 10px;
    }
    
    .config-option-item {
        display: flex;
        flex-direction: column;
        gap: 6px;
        
        label {
            margin-bottom: 4px;
            font-size: 14px;
        }
        
        .checkbox-wrapper {
            display: flex;
            align-items: center;
            gap: 8px;
            
            input[type="checkbox"] {
                width: auto;
            }
            
            label {
                margin-bottom: 0;
            }
        }
    }

    label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: var(--text-secondary);
    }

    input,
    textarea,
    select {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        font-size: 14px;
        background: var(--bg-primary);
        color: var(--text-primary);

        &:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.2);
        }
    }

    textarea {
        resize: vertical;
        min-height: 100px;
    }
}

.preset-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 10px;
    margin-bottom: 20px;
}

.preset-item {
    padding: 10px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    cursor: pointer;
    text-align: center;
    transition: all 0.2s;
    background: var(--bg-primary);

    &:hover {
        border-color: var(--primary-color);
        background: rgba(var(--primary-color-rgb), 0.1);
    }

    &.active {
        border-color: var(--primary-color);
        background: rgba(var(--primary-color-rgb), 0.1);
    }

    .preset-icon {
        font-size: 24px;
        margin-bottom: 8px;
    }

    .preset-name {
        font-size: 14px;
        color: var(--text-secondary);
    }
}

.generate-btn {
    width: 100%;
    padding: 12px;
    background: linear-gradient(90deg, var(--primary-color) 0%, #a1c4fd 100%);
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s, box-shadow 0.2s;
    box-shadow: 0 2px 8px 0 rgba(var(--primary-color-rgb),0.10);

    &:hover {
        opacity: 0.92;
        box-shadow: 0 4px 16px 0 rgba(var(--primary-color-rgb),0.18);
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
}

.error-message {
    margin-top: 10px;
    padding: 10px;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid #ef4444;
    border-radius: 4px;
    color: #ef4444;
    font-size: 14px;
}

.progress-bar {
    margin-top: 10px;
    height: 6px;
    background: var(--border-color);
    border-radius: 3px;
    overflow: hidden;

    .progress-inner {
        height: 100%;
        background: var(--primary-color);
        transition: width 0.3s ease;
    }

    .progress-text {
        display: block;
        text-align: center;
        margin-top: 5px;
        font-size: 12px;
        color: var(--text-secondary);
    }
}

.code-panel {
    background: rgba(var(--primary-color-rgb), 0.12);
    border-radius: 18px;
    box-shadow: 0 4px 24px 0 rgba(100,108,255,0.08), 0 1.5px 8px 0 rgba(0,0,0,0.06);
    overflow: hidden;

    .code-header {
        padding: 15px 20px;
        border-bottom: 1px solid var(--border-color);
        display: flex;
        justify-content: space-between;
        align-items: center;

        h3 {
            margin: 0;
            font-size: 1.2rem;
            color: var(--text-primary);
        }
    }

    .code-actions {
        display: flex;
        gap: 10px;

        .action-btn {
            padding: 6px 12px;
            border: 1px solid var(--primary-color);
            border-radius: 4px;
            background: transparent;
            color: var(--primary-color);
            font-size: 14px;
            cursor: pointer;
            transition: all 0.2s;

            &:hover {
                background: var(--primary-color);
                color: white;
            }
        }
    }

    .code-preview {
        height: 600px;
        background: var(--bg-primary);
        overflow: hidden;
        max-width: 100%;

        iframe {
            width: 100%;
            height: 100%;
            border: none;
            max-width: 100%;
        }
    }

    .code-content {
        padding: 20px;
        overflow-x: auto;

        .code-folded-notice,
        .skip-animation-notice {
            background: rgba(var(--primary-color-rgb), 0.1);
            padding: 8px 15px;
            border-radius: 6px 6px 0 0;
            margin-bottom: 0;
            border-bottom: 1px dashed var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
            
            p {
                margin: 0;
                color: var(--primary-color);
                font-size: 14px;
            }
            
            .show-full-code-btn,
                .skip-animation-btn {
                padding: 4px 8px;
                background: var(--primary-color);
                color: white;
                border: none;
                border-radius: 4px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s;
                
                &:hover {
                    opacity: 0.9;
                }
            }
        }

        pre {
            margin: 0;
            padding: 15px;
            background: var(--bg-primary);
            border-radius: 6px;
            border-top-left-radius: 0;
            border-top-right-radius: 0;
            font-family: 'Fira Code', monospace;
            font-size: 14px;
            line-height: 1.5;
            text-align: left;
            white-space: pre-wrap;
            word-break: break-all;
        }

        .empty-code {
            text-align: center;
            padding: 40px;
            color: var(--text-secondary);

            p {
                margin: 0;
                font-size: 16px;
            }
        }
    }
}
</style>