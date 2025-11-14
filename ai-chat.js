// ai-chat.js - Enhanced with role context
class AIChat {
    constructor() {
        this.isOpen = false;
        this.chatHistory = [];
        this.init();
    }

    init() {
        document.getElementById('ai-chat-toggle').addEventListener('click', () => this.toggleChat());
        document.getElementById('close-chat').addEventListener('click', () => this.toggleChat());
        document.getElementById('send-message').addEventListener('click', () => this.sendMessage());
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        setTimeout(() => this.createRoleQuickActions(), 1000);
    }

    createRoleQuickActions() {
        const messagesContainer = document.getElementById('chat-messages');
        let quickActions = document.querySelector('.quick-actions');
        
        if (quickActions) quickActions.remove();

        quickActions = document.createElement('div');
        quickActions.className = 'quick-actions';

        const userRole = auth.userProfile?.role || ROLES.GAMER;
        const actions = this.getRoleQuickActions(userRole);

        actions.forEach(action => {
            const btn = document.createElement('button');
            btn.className = 'quick-action-btn';
            btn.textContent = action.text;
            btn.onclick = () => this.sendQuickAction(action.prompt);
            quickActions.appendChild(btn);
        });

        messagesContainer.appendChild(quickActions);
    }

    getRoleQuickActions(userRole) {
        const baseActions = [
            { text: "🤖 General Help", prompt: "What can you help me with based on my role?" }
        ];

        const roleActions = {
            [ROLES.GAMER]: [
                { text: "🎮 Game Recommendations", prompt: "Recommend some games I might like" },
                { text: "💡 Gaming Tips", prompt: "Share some general gaming tips and strategies" },
                { text: "📊 Game Reviews", prompt: "What makes a game highly rated and popular?" }
            ],
            [ROLES.CONTENT_CREATOR]: [
                { text: "🎥 Content Ideas", prompt: "Give me content ideas for my gaming channel" },
                { text: "📈 Growth Tips", prompt: "How can I grow my gaming content audience?" },
                { text: "🎯 Trend Analysis", prompt: "What gaming trends should I focus on?" }
            ],
            [ROLES.TEACHER]: [
                { text: "👨‍🏫 Educational Games", prompt: "Recommend educational games for students" },
                { text: "📚 Learning Strategies", prompt: "How to use games for effective learning?" },
                { text: "🎮 Classroom Gaming", prompt: "Tips for integrating games in classroom" }
            ],
            [ROLES.ADMIN]: [
                { text: "⚙️ Platform Management", prompt: "Best practices for platform management" },
                { text: "📊 User Analytics", prompt: "How to analyze user engagement and growth?" },
                { text: "👥 Community Building", prompt: "Strategies for building gaming community" }
            ],
            [ROLES.OWNER]: [
                { text: "🚀 Business Growth", prompt: "Strategies for platform growth and monetization" },
                { text: "📈 Market Analysis", prompt: "Gaming platform market trends and opportunities" },
                { text: "💡 Innovation Ideas", prompt: "Innovative features for gaming platforms" }
            ]
        };

        return [...baseActions, ...(roleActions[userRole] || [])];
    }

    async sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;

        this.addMessage('user', message);
        input.value = '';
        this.showTypingIndicator();

        const response = await gameAI.chatAboutGaming(message);
        
        this.removeTypingIndicator();
        this.addMessage('ai', response);
    }

    sendQuickAction(prompt) {
        document.getElementById('chat-input').value = prompt;
        this.sendMessage();
    }

    async getContentIdeas() {
        this.addMessage('user', 'Give me content ideas for my gaming content');
        this.showTypingIndicator();
        
        const ideas = await gameAI.getContentIdeas();
        this.removeTypingIndicator();
        this.addMessage('ai', ideas);
    }

    async getEducationalGames() {
        this.addMessage('user', 'Suggest educational games and teaching strategies');
        this.showTypingIndicator();
        
        const suggestions = await gameAI.getEducationalGames();
        this.removeTypingIndicator();
        this.addMessage('ai', suggestions);
    }

    async askForRecommendations(preferences) {
        this.addMessage('user', 'Recommend games based on my preferences');
        this.showTypingIndicator();
        
        const userGames = auth.userProfile ? await gameDB.getUserGames(auth.currentUser.uid) : [];
        const gameNames = userGames.map(g => g.name);
        
        const recommendations = await gameAI.getGameRecommendations(preferences, gameNames);
        this.removeTypingIndicator();
        this.addMessage('ai', recommendations);
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const chatWidget = document.getElementById('ai-chat-widget');
        chatWidget.classList.toggle('active', this.isOpen);
        
        if (this.isOpen) {
            document.getElementById('chat-input').focus();
            // Refresh quick actions when opening chat
            setTimeout(() => this.createRoleQuickActions(), 100);
        }
    }

    addMessage(sender, text) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        const quickActions = document.querySelector('.quick-actions');
        if (quickActions && sender === 'user') {
            quickActions.remove();
        }
        
        this.chatHistory.push({ sender, text, timestamp: new Date() });
        if (this.chatHistory.length > 50) {
            this.chatHistory.shift();
        }
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chat-messages');
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'message ai typing';
        typingDiv.textContent = 'GamePulse AI is thinking...';
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
}

const aiChat = new AIChat();