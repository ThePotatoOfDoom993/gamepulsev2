// app.js - Enhanced with role management
class GamePulseApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.userGames = [];
        this.userContent = [];
        this.init();
    }

    async init() {
        this.setupEventListeners();
        this.setupNavigation();
        
        setTimeout(async () => {
            if (auth.userProfile) {
                await this.loadUserData();
                this.initializeRoleFeatures();
            } else {
                await this.loadPublicData();
            }
        }, 100);
    }

    setupEventListeners() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.getAttribute('data-section');
                this.showSection(section);
            });
        });

        document.getElementById('search-button').addEventListener('click', () => this.performSearch());
        document.getElementById('game-search-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performSearch();
        });

        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.showAdminTab(e.target.getAttribute('data-tab'));
            });
        });

        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModals();
            }
        });

        window.addEventListener('click', (e) => {
            if (!e.target.matches('#user-menu-btn')) {
                document.querySelector('.user-dropdown')?.classList.remove('show');
            }
        });

        // Add game form
        document.getElementById('add-game-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAddGame();
        });
    }

    setupNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.showSection(section);
            });
        });
    }

    async loadUserData() {
        if (auth.userProfile) {
            await this.loadUserGames();
            await this.loadUserContent();
            await this.loadUserStats();
            
            if (auth.isAdmin()) {
                await this.loadAdminData();
            }
        }
    }

    async loadPublicData() {
        this.displaySampleGames();
        this.displayPublicStats();
        await this.loadCommunityStats();
    }

    async loadUserGames() {
        try {
            this.userGames = await gameDB.getUserGames(auth.currentUser.uid);
            this.displayUserGames();
            this.updateGameStats();
        } catch (error) {
            console.error("Error loading user games:", error);
        }
    }

    async loadUserContent() {
        if (auth.isContentCreator() || auth.isTeacher()) {
            try {
                this.userContent = await gameDB.getUserContent(auth.currentUser.uid);
                this.displayUserContent();
            } catch (error) {
                console.error("Error loading user content:", error);
            }
        }
    }

    async loadUserStats() {
        const stats = auth.userProfile.stats || {};
        
        switch (auth.userProfile.role) {
            case ROLES.GAMER:
                document.getElementById('gamer-games-count').textContent = stats.gamesCount || 0;
                document.getElementById('gamer-playtime-total').textContent = `${stats.totalPlaytime || 0}h`;
                document.getElementById('gamer-achievements-count').textContent = stats.achievements || 0;
                break;
            case ROLES.CONTENT_CREATOR:
                document.getElementById('content-count').textContent = stats.contentCount || 0;
                document.getElementById('views-total').textContent = stats.totalViews || 0;
                document.getElementById('engagement-rate').textContent = `${stats.engagement || 0}%`;
                break;
            case ROLES.TEACHER:
                document.getElementById('students-count').textContent = stats.studentsCount || 0;
                document.getElementById('resources-count').textContent = stats.resourcesCount || 0;
                document.getElementById('progress-rate').textContent = `${stats.progressRate || 0}%`;
                break;
            case ROLES.ADMIN:
                document.getElementById('total-users').textContent = stats.managedUsers || 0;
                document.getElementById('total-games').textContent = stats.totalGames || 0;
                document.getElementById('platform-health').textContent = `${stats.health || 100}%`;
                break;
            case ROLES.OWNER:
                document.getElementById('platform-revenue').textContent = `$${stats.platformRevenue || 0}`;
                document.getElementById('owner-total-users').textContent = stats.totalUsers || 0;
                document.getElementById('growth-rate').textContent = `${stats.growthRate || 0}%`;
                break;
        }
    }

    async loadAdminData() {
        try {
            const users = await gameDB.getAllUsers();
            this.displayUsersList(users);
            
            const platformStats = await gameDB.getPlatformStats();
            this.updateAdminStats(platformStats);
            
            // Show owner tools if user is owner
            if (auth.isOwner()) {
                this.showOwnerTools();
            }
        } catch (error) {
            console.error("Error loading admin data:", error);
        }
    }

    async loadCommunityStats() {
        const communityStats = await gameDB.getCommunityStats();
        this.displayCommunityStats(communityStats);
    }

    initializeRoleFeatures() {
        if (auth.isGamer()) {
            this.initializeGamerFeatures();
        } else if (auth.isContentCreator()) {
            this.initializeContentCreatorFeatures();
        } else if (auth.isTeacher()) {
            this.initializeTeacherFeatures();
        } else if (auth.isAdmin()) {
            this.initializeAdminFeatures();
        }
    }

    initializeGamerFeatures() {
        console.log("Initializing gamer features");
    }

    initializeContentCreatorFeatures() {
        console.log("Initializing content creator features");
    }

    initializeTeacherFeatures() {
        console.log("Initializing teacher features");
    }

    initializeAdminFeatures() {
        console.log("Initializing admin features");
    }

    showSection(sectionName) {
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        const targetLink = document.querySelector(`[data-section="${sectionName}"]`);
        if (targetLink) {
            targetLink.classList.add('active');
        }
        
        this.currentSection = sectionName;
        this.loadSectionData(sectionName);
    }

    loadSectionData(sectionName) {
        switch (sectionName) {
            case 'games':
                this.loadGamesSection();
                break;
            case 'content':
                this.loadContentSection();
                break;
            case 'admin':
                this.loadAdminSection();
                break;
            case 'community':
                this.loadCommunitySection();
                break;
        }
    }

    async loadGamesSection() {
        if (auth.userProfile) {
            await this.loadUserGames();
        } else {
            this.displaySampleGames();
        }
    }

    async loadContentSection() {
        if (auth.hasPermission('create_content')) {
            await this.loadUserContent();
        }
    }

    async loadAdminSection() {
        if (auth.isAdmin()) {
            await this.loadAdminData();
        }
    }

    async loadCommunitySection() {
        await this.loadCommunityStats();
    }

    async performSearch() {
        const query = document.getElementById('game-search-input').value.trim();
        const resultsContainer = document.getElementById('games-container');
        
        if (!query) {
            if (auth.userProfile) {
                await this.loadUserGames();
            } else {
                this.displaySampleGames();
            }
            return;
        }

        resultsContainer.innerHTML = '<div class="loading">Searching for games... 🔍</div>';
        const results = await gameDB.searchGames(query);
        this.displaySearchResults(results);
    }

    displaySearchResults(games) {
        const container = document.getElementById('games-container');
        
        if (games.length === 0) {
            container.innerHTML = '<div class="no-results">No games found. Try a different search term.</div>';
            return;
        }

        container.innerHTML = games.map(game => `
            <div class="game-card" data-game-id="${game.id}">
                <div class="game-card-header">
                    <div class="game-icon">${game.image}</div>
                    <div class="game-info">
                        <h4>${game.name}</h4>
                        <span class="game-rating">⭐ ${game.rating}/5</span>
                    </div>
                </div>
                <div class="game-genres">
                    ${game.genre.map(genre => `<span class="genre-tag">${genre}</span>`).join('')}
                </div>
                <p class="game-description">${game.description}</p>
                <div class="game-actions">
                    ${auth.userProfile ? `
                        <button class="add-to-collection-btn" onclick="app.addGameToCollection(${game.id})">
                            ➕ Add to Collection
                        </button>
                    ` : `
                        <button class="login-prompt-btn" onclick="auth.showAuthModal()">
                            🔒 Login to Add
                        </button>
                    `}
                    <button class="get-tips-btn" onclick="app.getGameTips('${game.name}')">
                        💡 Get Tips
                    </button>
                    <button class="review-btn" onclick="app.getGameReview('${game.name}')">
                        📊 Review
                    </button>
                </div>
            </div>
        `).join('');
    }

    displaySampleGames() {
        const container = document.getElementById('games-container');
        if (!container) return;

        container.innerHTML = SAMPLE_GAMES.map(game => `
            <div class="game-card">
                <div class="game-card-header">
                    <div class="game-icon">${game.image}</div>
                    <div class="game-info">
                        <h4>${game.name}</h4>
                        <span class="game-rating">⭐ ${game.rating}/5</span>
                    </div>
                </div>
                <div class="game-genres">
                    ${game.genre.map(genre => `<span class="genre-tag">${genre}</span>`).join('')}
                </div>
                <p class="game-description">${game.description}</p>
                <div class="game-actions">
                    <button class="login-prompt-btn" onclick="auth.showAuthModal()">
                        🔒 Login to Add
                    </button>
                    <button class="get-tips-btn" onclick="app.getGameTips('${game.name}')">
                        💡 Get Tips
                    </button>
                    <button class="review-btn" onclick="app.getGameReview('${game.name}')">
                        📊 Review
                    </button>
                </div>
            </div>
        `).join('');
    }

    displayUserGames() {
        const container = document.getElementById('games-container');
        if (!container) return;

        if (this.userGames.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>🎮 No games in your library yet!</p>
                    <p>Search for games above and add them to get started.</p>
                    <button class="primary-btn" onclick="app.showAddGameModal()">Add Your First Game</button>
                </div>
            `;
            return;
        }

        container.innerHTML = this.userGames.map(game => `
            <div class="game-card">
                <div class="game-card-header">
                    <div class="game-icon">${game.image || '🎮'}</div>
                    <div class="game-info">
                        <h4>${game.name}</h4>
                        <span class="game-rating">⭐ ${game.rating || 'N/A'}</span>
                    </div>
                </div>
                <div class="game-genres">
                    ${(game.genre || []).map(genre => `<span class="genre-tag">${genre}</span>`).join('')}
                </div>
                <p class="game-description">${game.description || 'No description available.'}</p>
                <div class="game-actions">
                    <button class="get-tips-btn" onclick="app.getGameTips('${game.name}')">
                        💡 Get Tips
                    </button>
                    <button class="review-btn" onclick="app.getGameReview('${game.name}')">
                        📊 Review
                    </button>
                    <button class="remove-btn" onclick="app.removeGameFromCollection('${game.id}')">
                        🗑️ Remove
                    </button>
                </div>
            </div>
        `).join('');
    }

    async addGameToCollection(gameId) {
        if (!auth.userProfile) {
            auth.showAuthModal();
            return;
        }

        const game = await gameDB.getGameById(gameId);
        if (!game) {
            this.showNotification('Game not found!', 'error');
            return;
        }

        const success = await gameDB.addUserGame(auth.currentUser.uid, game);
        if (success) {
            this.showNotification(`🎮 Added ${game.name} to your collection!`);
            await this.loadUserGames();
        } else {
            this.showNotification('Failed to add game to collection', 'error');
        }
    }

    async removeGameFromCollection(gameId) {
        const success = await gameDB.removeUserGame(auth.currentUser.uid, gameId);
        if (success) {
            this.showNotification('Game removed from collection');
            await this.loadUserGames();
        } else {
            this.showNotification('Failed to remove game', 'error');
        }
    }

    async getGameTips(gameName) {
        aiChat.addMessage('user', `Can you give me tips for ${gameName}?`);
        aiChat.showTypingIndicator();
        
        const tips = await gameAI.getGameTips(gameName);
        aiChat.removeTypingIndicator();
        aiChat.addMessage('ai', tips);
        aiChat.toggleChat();
    }

    async getGameReview(gameName) {
        aiChat.addMessage('user', `Can you give me a review summary of ${gameName}?`);
        aiChat.showTypingIndicator();
        
        const review = await gameAI.getGameReviewSummary(gameName);
        aiChat.removeTypingIndicator();
        aiChat.addMessage('ai', review);
        aiChat.toggleChat();
    }

    displayPublicStats() {
        document.getElementById('games-count').textContent = '0';
        document.getElementById('playtime-total').textContent = '0h';
        document.getElementById('achievements-count').textContent = '0';
    }

    displayCommunityStats(stats) {
        document.getElementById('active-gamers').textContent = stats.gamers || 0;
        document.getElementById('active-creators').textContent = stats.creators || 0;
        document.getElementById('active-teachers').textContent = stats.teachers || 0;
    }

    // Admin/Owner Methods
    updateAdminStats(stats) {
        document.getElementById('admin-total-users').textContent = stats.totalUsers || 0;
        document.getElementById('admin-total-games').textContent = stats.totalGames || 0;
        document.getElementById('admin-ai-usage').textContent = stats.aiUsage || 0;
        document.getElementById('admin-platform-health').textContent = `${stats.platformHealth || 100}%`;
        
        // Update main dashboard stats too
        document.getElementById('total-users').textContent = stats.totalUsers || 0;
        document.getElementById('total-games').textContent = stats.totalGames || 0;
        document.getElementById('db-total-games').textContent = stats.totalGames || 0;
    }

    showOwnerTools() {
        document.querySelectorAll('.owner-only').forEach(el => {
            el.style.display = 'block';
        });
        
        const adminBadge = document.getElementById('admin-level-badge');
        if (adminBadge) {
            adminBadge.textContent = 'Owner';
            adminBadge.style.background = ROLE_COLORS[ROLES.OWNER];
        }
    }

    displayUsersList(users) {
        const container = document.getElementById('users-list');
        if (!container) return;

        container.innerHTML = users.map(user => `
            <div class="user-list-item">
                <div class="user-info">
                    <div class="user-main">
                        <strong>${user.displayName}</strong>
                        <span class="user-email">${user.email}</span>
                    </div>
                    <div class="user-details">
                        <span class="user-role ${user.role}">${ROLE_DISPLAY_NAMES[user.role]}</span>
                        <span class="user-joined">Joined: ${new Date(user.createdAt?.toDate() || new Date()).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="user-actions">
                    <button class="btn-small" onclick="app.viewUserProfile('${user.uid}')">View</button>
                    ${auth.isAdmin() ? `<button class="btn-small" onclick="app.editUserRole('${user.uid}')">Edit Role</button>` : ''}
                    ${auth.isOwner() ? `
                        <button class="btn-small warning" onclick="app.resetUserPassword('${user.uid}')">Reset Password</button>
                        <button class="btn-small danger" onclick="app.deleteUser('${user.uid}')">Delete</button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    showAdminTab(tabName) {
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const targetTab = document.getElementById(`${tabName}-tab`);
        if (targetTab) {
            targetTab.classList.add('active');
        }
        
        const targetBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (targetBtn) {
            targetBtn.classList.add('active');
        }
    }

    // Owner-specific methods
    async createAdminUser() {
        if (!auth.isOwner()) return;
        
        this.showNotification('Admin user creation feature would be implemented here');
    }

    async exportPlatformData() {
        if (!auth.isOwner()) return;
        
        try {
            const users = await gameDB.getAllUsers();
            const data = {
                exportDate: new Date().toISOString(),
                exportedBy: auth.userProfile.displayName,
                users: users,
                totalUsers: users.length,
                platformVersion: '1.0.0'
            };
            
            const dataStr = JSON.stringify(data, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `gamepulse-export-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            URL.revokeObjectURL(url);
            
            this.showNotification('Platform data exported successfully!');
        } catch (error) {
            this.showNotification('Error exporting data: ' + error.message, 'error');
        }
    }

    manageApiKeys() {
        if (!auth.isOwner()) return;
        
        this.showNotification('API Key management would be implemented here');
    }

    // Admin methods
    async editUserRole(userId) {
        if (!auth.isAdmin()) return;
        
        const newRole = prompt("Enter new role (gamer, content-creator, teacher, admin):");
        if (!newRole || !ROLES[newRole.toUpperCase()]) {
            this.showNotification('Invalid role', 'error');
            return;
        }
        
        this.showNotification(`User role updated to ${newRole} (simulated)`);
        await this.loadAdminData();
    }

    viewUserProfile(userId) {
        this.showNotification('User profile view would open here');
    }

    resetUserPassword(userId) {
        if (!auth.isOwner()) return;
        this.showNotification('Password reset feature would be implemented here');
    }

    deleteUser(userId) {
        if (!auth.isOwner()) return;
        this.showNotification('User deletion feature would be implemented here');
    }

    // Game management
    showAddGameModal() {
        document.getElementById('add-game-modal').style.display = 'flex';
    }

    handleAddGame() {
        const title = document.getElementById('game-title').value;
        const genre = document.getElementById('game-genre').value;
        const notes = document.getElementById('game-notes').value;

        if (!title || !genre) {
            this.showNotification('Please fill required fields', 'error');
            return;
        }

        const gameData = {
            name: title,
            genre: [genre],
            description: notes || 'No description provided.',
            rating: 4.0,
            image: "🎮"
        };

        this.addGameToCollection(Date.now()); // Using timestamp as ID for demo
        this.closeModals();
    }

    addGameToDB() {
        this.showNotification('Add game to database feature would be implemented here');
    }

    manageGamesDB() {
        this.showSection('admin');
        this.showAdminTab('games-db');
    }

    manageUsers() {
        this.showSection('admin');
        this.showAdminTab('users');
    }

    viewAnalytics() {
        this.showSection('admin');
        this.showAdminTab('analytics');
    }

    ownerTools() {
        this.showSection('admin');
        this.showAdminTab('owner');
    }

    savePlatformSettings() {
        this.showNotification('Platform settings saved successfully!');
    }

    // Role-specific actions
    analyzeContent() {
        if (auth.isContentCreator()) {
            aiChat.addMessage('user', 'Can you analyze my content performance and suggest improvements?');
            aiChat.showTypingIndicator();
            setTimeout(() => {
                aiChat.removeTypingIndicator();
                aiChat.addMessage('ai', 'Based on your content patterns, I recommend focusing on tutorial content for popular games and engaging with your audience through live streams. Consider collaborating with other creators to expand your reach!');
                aiChat.toggleChat();
            }, 1000);
        }
    }

    manageStudents() {
        if (auth.isTeacher()) {
            this.showNotification('Student management features coming soon!');
        }
    }

    createLesson() {
        if (auth.isTeacher()) {
            aiChat.addMessage('user', 'Help me create an educational gaming lesson plan');
            aiChat.showTypingIndicator();
            setTimeout(() => {
                aiChat.removeTypingIndicator();
                aiChat.addMessage('ai', 'Great! For an educational gaming lesson, consider using Minecraft for creativity and problem-solving, or Civilization for history and strategy. Start with clear learning objectives and include reflection activities for students to connect gameplay to real-world concepts.');
                aiChat.toggleChat();
            }, 1000);
        }
    }

    closeModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    updateGameStats() {
        if (auth.userProfile && auth.isGamer()) {
            document.getElementById('gamer-games-count').textContent = this.userGames.length;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new GamePulseApp();
});