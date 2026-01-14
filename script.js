// DeepSeek API配置
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
// 注意：实际使用时需要在后端配置API密钥，这里使用环境变量或配置
const DEEPSEEK_API_KEY = 'YOUR_DEEPSEEK_API_KEY'; // 需要替换为实际的API密钥

// 状态管理
let chatHistory = [];
let currentChatId = null;

// DOM元素（延迟初始化，确保DOM已加载）
let sidebar, sidebarToggle, newChatBtn, newChatSidebar;
let chatMessages, welcomeScreen, inputArea;
let chatInput, messageInput, sendBtn, sendBtnSmall;
let chatHistoryContainer;

// 初始化DOM元素
function initDOMElements() {
    sidebar = document.getElementById('sidebar');
    sidebarToggle = document.getElementById('sidebar-toggle');
    newChatBtn = document.getElementById('new-chat-btn');
    newChatSidebar = document.getElementById('new-chat-sidebar');
    chatMessages = document.getElementById('chat-messages');
    welcomeScreen = document.getElementById('welcome-screen');
    inputArea = document.getElementById('input-area');
    chatInput = document.getElementById('chat-input');
    messageInput = document.getElementById('message-input');
    sendBtn = document.getElementById('send-btn');
    sendBtnSmall = document.getElementById('send-btn-small');
    chatHistoryContainer = document.getElementById('chat-history');
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化DOM元素
    initDOMElements();
    
    // 检查关键元素是否存在
    if (!sidebar || !chatMessages || !welcomeScreen) {
        console.error('关键DOM元素未找到');
        return;
    }

    // 侧边栏切换
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
            const mainContent = document.querySelector('.main-content');
            if (mainContent) {
                mainContent.classList.toggle('sidebar-open');
            }
        });
    }

    // 新聊天按钮
    if (newChatBtn) {
        newChatBtn.addEventListener('click', startNewChat);
    }
    if (newChatSidebar) {
        newChatSidebar.addEventListener('click', startNewChat);
    }

    // 发送消息
    if (sendBtn) {
        sendBtn.addEventListener('click', handleSendMessage);
    }
    if (sendBtnSmall) {
        sendBtnSmall.addEventListener('click', handleSendMessage);
    }

    // 回车发送
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        });
    }

    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        });
    }

    // 加载聊天历史
    loadChatHistory();
    
    console.log('Bitchain AI 初始化完成');
});

// 开始新聊天
function startNewChat() {
    currentChatId = Date.now().toString();
    chatHistory = [];
    chatMessages.innerHTML = '';
    welcomeScreen.style.display = 'flex';
    inputArea.style.display = 'none';
    chatInput.value = '';
    messageInput.value = '';
}

// 发送消息
async function handleSendMessage() {
    const input = welcomeScreen.style.display !== 'none' 
        ? chatInput 
        : messageInput;
    
    const message = input.value.trim();
    
    if (!message) return;

    // 隐藏欢迎界面，显示输入区域
    if (welcomeScreen.style.display !== 'none') {
        welcomeScreen.style.display = 'none';
        inputArea.style.display = 'block';
    }

    // 添加用户消息
    addMessage('user', message);
    input.value = '';

    // 禁用发送按钮
    sendBtn.disabled = true;
    sendBtnSmall.disabled = true;

    // 显示加载动画
    const loadingId = addLoadingMessage();

    try {
        // 调用DeepSeek API
        const response = await callDeepSeekAPI(message);
        
        // 移除加载动画
        removeLoadingMessage(loadingId);
        
        // 添加AI回复
        addMessage('assistant', response);
        
        // 保存到聊天历史
        saveChatHistory();
    } catch (error) {
        console.error('Error:', error);
        removeLoadingMessage(loadingId);
        addMessage('assistant', '抱歉，发生了错误。请稍后重试。错误信息：' + error.message);
    } finally {
        // 启用发送按钮
        sendBtn.disabled = false;
        sendBtnSmall.disabled = false;
    }
}

// 调用DeepSeek API
async function callDeepSeekAPI(message) {
    // 构建消息历史
    const messages = chatHistory.map(msg => ({
        role: msg.role,
        content: msg.content
    }));
    
    // 添加当前消息
    messages.push({
        role: 'user',
        content: message
    });

    // 添加到聊天历史
    chatHistory.push({
        role: 'user',
        content: message
    });

    try {
        const response = await fetch(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: messages,
                temperature: 0.7,
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `API错误: ${response.status}`);
        }

        const data = await response.json();
        const assistantMessage = data.choices[0].message.content;
        
        // 添加到聊天历史
        chatHistory.push({
            role: 'assistant',
            content: assistantMessage
        });

        return assistantMessage;
    } catch (error) {
        // 如果API调用失败，使用模拟回复（用于演示）
        console.warn('API调用失败，使用模拟回复:', error);
        return getMockResponse(message);
    }
}

// 模拟回复（当API不可用时）
function getMockResponse(message) {
    const responses = [
        `关于"${message}"，这是一个很好的问题。在区块链和加密领域，这涉及到多个方面的考虑。`,
        `根据您的问题"${message}"，我可以为您提供以下分析：这是一个复杂的主题，需要从多个角度来理解。`,
        `针对"${message}"这个问题，让我为您详细解释一下相关的概念和背景。`
    ];
    return responses[Math.floor(Math.random() * responses.length)] + 
           '\n\n（注意：当前使用模拟回复。请配置DeepSeek API密钥以获取真实AI回答。）';
}

// 添加消息到聊天界面
function addMessage(role, content) {
    if (!chatMessages) {
        console.error('chatMessages元素未找到');
        return;
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${role}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    // 格式化消息内容（支持Markdown基本格式）
    contentDiv.innerHTML = formatMessage(content);
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    
    // 滚动到底部
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
}

// 格式化消息内容
function formatMessage(text) {
    // 转义HTML
    let html = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    
    // 简单的Markdown支持
    html = html
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>');
    
    // 代码块
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
    
    return html;
}

// 添加加载动画
function addLoadingMessage() {
    if (!chatMessages) {
        console.error('chatMessages元素未找到');
        return 'loading-message';
    }
    
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message message-assistant';
    loadingDiv.id = 'loading-message';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content loading';
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'loading-dot';
        contentDiv.appendChild(dot);
    }
    
    loadingDiv.appendChild(contentDiv);
    chatMessages.appendChild(loadingDiv);
    
    setTimeout(() => {
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }, 100);
    
    return 'loading-message';
}

// 移除加载动画
function removeLoadingMessage(id) {
    const loadingMsg = document.getElementById(id);
    if (loadingMsg) {
        loadingMsg.remove();
    }
}

// 保存聊天历史
function saveChatHistory() {
    if (currentChatId) {
        const history = {
            id: currentChatId,
            messages: chatHistory,
            timestamp: Date.now()
        };
        localStorage.setItem(`chat_${currentChatId}`, JSON.stringify(history));
        updateChatHistoryList();
    }
}

// 加载聊天历史
function loadChatHistory() {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('chat_'));
    keys.sort((a, b) => {
        const chatA = JSON.parse(localStorage.getItem(a));
        const chatB = JSON.parse(localStorage.getItem(b));
        return chatB.timestamp - chatA.timestamp;
    });
    
    keys.forEach(key => {
        const chat = JSON.parse(localStorage.getItem(key));
        addChatToHistory(chat);
    });
}

// 添加聊天到历史列表
function addChatToHistory(chat) {
    const historyItem = document.createElement('div');
    historyItem.className = 'chat-history-item';
    historyItem.textContent = chat.messages[0]?.content?.substring(0, 50) || '新聊天';
    historyItem.addEventListener('click', () => loadChat(chat));
    chatHistoryContainer.appendChild(historyItem);
}

// 加载聊天
function loadChat(chat) {
    currentChatId = chat.id;
    chatHistory = chat.messages;
    
    chatMessages.innerHTML = '';
    welcomeScreen.style.display = 'none';
    inputArea.style.display = 'block';
    
    chat.messages.forEach(msg => {
        addMessage(msg.role, msg.content);
    });
}

// 更新聊天历史列表
function updateChatHistoryList() {
    // 这里可以添加逻辑来更新侧边栏的聊天历史列表
}
