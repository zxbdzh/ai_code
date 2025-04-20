var I=Object.defineProperty;var S=(r,t,e)=>t in r?I(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e;var b=(r,t,e)=>S(r,typeof t!="symbol"?t+"":t,e);import{A as $}from"./index-DRbvi2iR.js";class H extends ${constructor(){super(...arguments);b(this,"baseURL","https://api.openai.com/v1")}async generateCode(e,n){var l,d,m,y;try{const o=e.apiKey||this.apiKey;if(!o)throw new Error("API密钥未提供");const f=`
        请直接生成一个完整的${e.gameType}游戏HTML文件，不需要解释代码。
        具体要求如下：
        ${e.prompt}
        
        技术要求：
        1. 生成一个完整的HTML文件，包含所有必要的CSS和JavaScript代码
        2. 确保代码可以直接在浏览器中运行，不依赖任何外部文件或CDN
        3. 代码需要清晰易读，包含适当的注释
        4. 使用现代ES6+语法
        5. 确保游戏具有响应式设计
        ${e.gameType==="Flappy Bird"?"6. 游戏速度必须适中，不要太快，确保玩家有足够的反应时间":""}
        ${e.customIcon?`${e.gameType==="Flappy Bird"?"7":"6"}. 使用以下图标：${e.customIcon}`:""}
        
        在HTML底部添加简短的游戏说明，不要在回复中添加任何其他解释性文本。
        直接输出完整的HTML代码，不要有任何前缀或后缀说明。
      `.trim(),c=await fetch(`${this.baseURL}/chat/completions`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${o}`},body:JSON.stringify({model:"gpt-3.5-turbo",messages:[{role:"system",content:"你是一个专业的游戏开发助手，精通HTML5游戏开发。只输出完整的HTML代码，不要有任何解释性文本。代码应当可以直接运行，并在底部包含简短的游戏说明。同时语言为中文，代码中包含中文注释。不能有游戏分辨率超过容器等问题。"},{role:"user",content:f}],stream:!0,temperature:.8,max_tokens:4e3,presence_penalty:.2,frequency_penalty:.3})});if(!c.ok){const s=await c.json(),p=((l=s.error)==null?void 0:l.message)||"未知错误";throw console.error("OpenAI API错误:",s),new Error(`API请求失败: ${p}。请检查API密钥是否正确，或稍后重试。`)}const h=(d=c.body)==null?void 0:d.getReader(),L=new TextDecoder("utf-8");let i="";if(h)for(;;){const{done:s,value:p}=await h.read();if(s)break;const A=L.decode(p).split(`
`).filter(a=>a.trim()!=="");for(const a of A)if(a.startsWith("data: ")){const u=a.substring(6);if(u==="[DONE]")continue;try{const T=((y=(m=JSON.parse(u).choices[0])==null?void 0:m.delta)==null?void 0:y.content)||"";T&&(i+=T,n&&n(i))}catch(w){console.error("解析响应失败:",w)}}}return i}catch(o){throw console.error("生成代码时出错:",o),o}}createDownloadLink(e){const n=new Blob([e],{type:"text/html"});return URL.createObjectURL(n)}}export{H as OpenAIService};
