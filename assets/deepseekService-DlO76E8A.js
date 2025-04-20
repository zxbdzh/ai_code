var A=Object.defineProperty;var I=(o,t,e)=>t in o?A(o,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[t]=e;var T=(o,t,e)=>I(o,typeof t!="symbol"?t+"":t,e);import{A as M}from"./index-CprKY3oJ.js";class v extends M{constructor(){super(...arguments);T(this,"baseURL","https://api.deepseek.com/v1")}async generateCode(e,n){var d,l,h,m;try{const r=e.apiKey||this.apiKey;if(!r)throw new Error("API密钥未提供");const k=`
        请直接生成一个完整的${e.gameType}游戏HTML文件，不需要解释代码。
        具体要求如下：
        ${e.prompt}
        
        技术要求：
        1. 生成一个完整的HTML文件，包含所有必要的CSS和JavaScript代码
        2. 确保代码可以直接在浏览器中运行，不依赖任何外部文件或CDN
        3. 代码需要清晰易读，包含适当的注释
        4. 使用现代ES6+语法
        5. 确保游戏具有响应式设计
        ${e.customIcon?`6. 使用以下图标：${e.customIcon}`:""}
        
        在HTML底部添加简短的游戏说明，不要在回复中添加任何其他解释性文本。
        直接输出完整的HTML代码，不要有任何前缀或后缀说明。
      `.trim(),c=await fetch(`${this.baseURL}/chat/completions`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${r}`},body:JSON.stringify({model:"deepseek-chat",messages:[{role:"system",content:"你是一个专业的游戏开发助手，精通HTML5游戏开发。只输出完整的HTML代码，不要有任何解释性文本。代码应当可以直接运行，并在底部包含简短的游戏说明。同时语言为中文，代码中包含中文注释。不能有游戏分辨率超过容器等问题。"},{role:"user",content:k}],stream:!0,temperature:.8,max_tokens:4e3})});if(!c.ok){const s=await c.json(),p=((d=s.error)==null?void 0:d.message)||"未知错误";throw console.error("Deepseek API错误:",s),new Error(`API请求失败: ${p}。请检查API密钥是否正确，或稍后重试。`)}const u=(l=c.body)==null?void 0:l.getReader(),S=new TextDecoder("utf-8");let i="";if(u)for(;;){const{done:s,value:p}=await u.read();if(s)break;const L=S.decode(p).split(`
`).filter(a=>a.trim()!=="");for(const a of L)if(a.startsWith("data: ")){const y=a.slice(6);if(y==="[DONE]")continue;try{const w=((m=(h=JSON.parse(y).choices[0])==null?void 0:h.delta)==null?void 0:m.content)||"";w&&(i+=w,n==null||n(i))}catch(f){console.error("解析响应数据失败:",f)}}}return i}catch(r){throw console.error("生成代码错误:",r),r}}}export{v as DeepseekService};
