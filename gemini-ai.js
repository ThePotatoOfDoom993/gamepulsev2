// gemini-ai.js - Enhanced with role-specific AI
class GamePulseAI {
    constructor() {
        this.apiKey = "AIzaSyAI7El96qCvHloLspzVk7haX53SxWRdtsY";
        this.model = null;
        this.isInitialized = false;
        this.init();
    }

    async init() {
        try {
            if (!this.apiKey) {
                console.warn("Gemini API key not configured. AI features will be disabled.");
                return;
            }

            const genAI = new GoogleGenerativeAI(this.apiKey);
            this.model = genAI.getGenerativeModel({ 
                model: "gemini-pro",
                generationConfig: {
                    maxOutputTokens: 1000,
                    temperature: 0.7,
                }
            });
            this.isInitialized = true;
            console.log("Gemini AI initialized successfully");
        } catch (error) {
            console.error("Failed to initialize Gemini AI:", error);
            this.isInitialized = false;
        }
    }

    async generateResponse(prompt) {
        if (!this.isInitialized) {
            return "🤖 AI features are currently unavailable. Please check your API configuration.";
        }

        try {
            if (auth.userProfile) {
                await this.trackAIUsage(auth.userProfile.uid);
            }

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error("AI Error:", error);
            return "❌ I'm having trouble connecting right now. Please try again later.";
        }
    }

    async trackAIUsage(userId) {
        try {
            await auth.db.collection('users').doc(userId).update({
                'stats.aiUsage': firebase.firestore.FieldValue.increment(1),
                'lastAIActivity': firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error("Error tracking AI usage:", error);
        }
    }

    // Role-specific AI methods
    async getRoleSpecificResponse(userMessage, userRole) {
        const roleContexts = {
            [ROLES.GAMER]: "You're helping a gamer with game recommendations, tips, and gaming advice.",
            [ROLES.CONTENT_CREATOR]: "You're helping a content creator with content ideas, audience engagement, and gaming trends.",
            [ROLES.TEACHER]: "You're helping a teacher with educational games, learning strategies, and student engagement.",
            [ROLES.ADMIN]: "You're helping an admin with platform management, user analytics, and community growth.",
            [ROLES.OWNER]: "You're helping the platform owner with business insights, platform strategy, and growth opportunities."
        };

        const context = roleContexts[userRole] || "You're helping a GamePulse user.";
        
        const prompt = `
            ${context}
            User role: ${ROLE_DISPLAY_NAMES[userRole]}
            User message: "${userMessage}"
            
            Respond in a friendly, helpful tone. Be specific to their role when relevant.
            Use appropriate emojis. Keep responses concise but informative.
        `;

        return await this.generateResponse(prompt);
    }

    // Gamer-specific AI
    async getGameRecommendations(preferences, userGames = []) {
        const prompt = `
            As a gaming expert, recommend 3 games for a gamer based on:
            - Preferences: ${JSON.stringify(preferences)}
            - Current games: ${userGames.join(', ') || 'none'}
            
            For each game, provide:
            - Title and genre
            - Why it matches their taste
            - Key features they'll enjoy
            - Any important considerations
            
            Make it personalized and engaging! Use gaming emojis.
        `;

        return await this.generateResponse(prompt);
    }

    // Content Creator-specific AI
    async getContentIdeas(trendingGames = [], creatorStyle = "") {
        const prompt = `
            Generate 5 content ideas for a gaming content creator:
            - Trending games: ${trendingGames.join(', ')}
            - Creator style: ${creatorStyle || 'general gaming content'}
            
            Include:
            - Video/article topics
            - Engaging titles
            - Key talking points
            - Target audience appeal
            
            Make it creative and platform-optimized! 🎥
        `;

        return await this.generateResponse(prompt);
    }

    // Teacher-specific AI
    async getEducationalGames(ageGroup = "", learningGoals = "") {
        const prompt = `
            Recommend educational games and strategies for a teacher:
            - Age group: ${ageGroup || 'not specified'}
            - Learning goals: ${learningGoals || 'general education'}
            
            Include:
            - Game recommendations with educational value
            - Learning activities using games
            - Engagement strategies
            - Assessment ideas
            
            Focus on educational benefits! 👨‍🏫
        `;

        return await this.generateResponse(prompt);
    }

    // Admin-specific AI
    async getPlatformInsights(metrics = {}) {
        const prompt = `
            Provide platform management insights for an admin:
            - Current metrics: ${JSON.stringify(metrics)}
            
            Analyze:
            - User engagement trends
            - Potential issues
            - Growth opportunities
            - Community management tips
            
            Be strategic and data-informed! ⚙️
        `;

        return await this.generateResponse(prompt);
    }

    // Owner-specific AI
    async getBusinessInsights(platformData = {}) {
        const prompt = `
            Provide business insights for a platform owner:
            - Platform data: ${JSON.stringify(platformData)}
            
            Analyze:
            - Revenue opportunities
            - Market positioning
            - Competitive advantages
            - Growth strategies
            - Risk assessment
            
            Be strategic and business-focused! 👑
        `;

        return await this.generateResponse(prompt);
    }

    // General AI chat with role context
    async chatAboutGaming(userMessage) {
        const userRole = auth.userProfile?.role || ROLES.GAMER;
        return await this.getRoleSpecificResponse(userMessage, userRole);
    }

    // Game tips with role context
    async getGameTips(gameName, specificArea = "") {
        const prompt = specificArea 
            ? `Provide 3 advanced tips for ${gameName} focusing on: ${specificArea}. Make tips actionable and role-appropriate.`
            : `Provide 5 essential tips for ${gameName}. Include beginner to advanced advice.`;

        return await this.generateResponse(prompt);
    }

    async getGameReviewSummary(gameName) {
        const prompt = `
            Provide a balanced 150-word overview of ${gameName} covering:
            - What type of game it is 🎮
            - Key strengths 🌟
            - Potential drawbacks ⚠️
            - Who would enjoy it most 🎯
            - Overall impression 💫

            Be honest and informative. Use some emojis to make it engaging.
        `;

        return await this.generateResponse(prompt);
    }
}

const gameAI = new GamePulseAI();