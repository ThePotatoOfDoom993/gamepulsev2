// database.js - Enhanced with role-based data management
class GamePulseDB {
    constructor() {
        this.db = null;
        this.init();
    }

    init() {
        try {
            this.db = firebase.firestore();
        } catch (error) {
            console.warn("Firebase not available. Using local storage.");
        }
    }

    // User Games Management
    async getUserGames(userId) {
        try {
            if (this.db) {
                const snapshot = await this.db.collection('users').doc(userId).collection('games').get();
                return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            } else {
                const stored = localStorage.getItem(`gamepulse_games_${userId}`);
                return stored ? JSON.parse(stored) : [];
            }
        } catch (error) {
            console.error("Error getting user games:", error);
            return [];
        }
    }

    async addUserGame(userId, gameData) {
        try {
            if (this.db) {
                const gameRef = await this.db.collection('users').doc(userId).collection('games').add({
                    ...gameData,
                    addedAt: firebase.firestore.FieldValue.serverTimestamp(),
                    userId: userId
                });
                await this.updateUserStats(userId, 'gamesCount');
                return gameRef.id;
            } else {
                const games = await this.getUserGames(userId);
                const newGame = {
                    ...gameData,
                    id: Date.now().toString(),
                    addedAt: new Date().toISOString()
                };
                games.push(newGame);
                localStorage.setItem(`gamepulse_games_${userId}`, JSON.stringify(games));
                return newGame.id;
            }
        } catch (error) {
            console.error("Error adding user game:", error);
            return null;
        }
    }

    async removeUserGame(userId, gameId) {
        try {
            if (this.db) {
                await this.db.collection('users').doc(userId).collection('games').doc(gameId).delete();
                await this.updateUserStats(userId, 'gamesCount', -1);
                return true;
            } else {
                const games = await this.getUserGames(userId);
                const filteredGames = games.filter(game => game.id !== gameId);
                localStorage.setItem(`gamepulse_games_${userId}`, JSON.stringify(filteredGames));
                return true;
            }
        } catch (error) {
            console.error("Error removing user game:", error);
            return false;
        }
    }

    // Content Management
    async getUserContent(userId) {
        try {
            if (this.db) {
                const snapshot = await this.db.collection('content').where('userId', '==', userId).get();
                return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            } else {
                return [];
            }
        } catch (error) {
            console.error("Error getting user content:", error);
            return [];
        }
    }

    async addUserContent(userId, contentData) {
        try {
            if (this.db) {
                const contentRef = await this.db.collection('content').add({
                    ...contentData,
                    userId: userId,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    status: 'published'
                });
                await this.updateUserStats(userId, 'contentCount');
                return contentRef.id;
            }
        } catch (error) {
            console.error("Error adding user content:", error);
            return null;
        }
    }

    // Admin Methods
    async getAllUsers() {
        try {
            if (this.db) {
                const snapshot = await this.db.collection('users').get();
                return snapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
            } else {
                // Demo users for testing
                return [
                    {
                        uid: 'demo-owner',
                        email: 'aterrealms@gmail.com',
                        displayName: 'GamePulse Owner',
                        role: 'owner',
                        createdAt: { toDate: () => new Date() }
                    },
                    {
                        uid: 'demo-user1',
                        email: 'gamer@example.com',
                        displayName: 'Demo Gamer',
                        role: 'gamer',
                        createdAt: { toDate: () => new Date() }
                    }
                ];
            }
        } catch (error) {
            console.error("Error getting all users:", error);
            return [];
        }
    }

    async getPlatformStats() {
        try {
            if (this.db) {
                const usersSnapshot = await this.db.collection('users').get();
                const gamesSnapshot = await this.db.collectionGroup('games').get();
                
                return {
                    totalUsers: usersSnapshot.size,
                    totalGames: gamesSnapshot.size,
                    aiUsage: 0,
                    platformHealth: 100
                };
            } else {
                return {
                    totalUsers: 2,
                    totalGames: 5,
                    aiUsage: 12,
                    platformHealth: 100
                };
            }
        } catch (error) {
            console.error("Error getting platform stats:", error);
            return {};
        }
    }

    async getCommunityStats() {
        try {
            if (this.db) {
                const usersSnapshot = await this.db.collection('users').get();
                const users = usersSnapshot.docs.map(doc => doc.data());
                
                return {
                    gamers: users.filter(u => u.role === ROLES.GAMER).length,
                    creators: users.filter(u => u.role === ROLES.CONTENT_CREATOR).length,
                    teachers: users.filter(u => u.role === ROLES.TEACHER).length,
                    admins: users.filter(u => [ROLES.ADMIN, ROLES.OWNER].includes(u.role)).length
                };
            } else {
                return {
                    gamers: 1,
                    creators: 0,
                    teachers: 0,
                    admins: 1
                };
            }
        } catch (error) {
            console.error("Error getting community stats:", error);
            return {};
        }
    }

    // User Stats Management
    async updateUserStats(userId, statField, value = 1) {
        try {
            if (this.db) {
                await this.db.collection('users').doc(userId).update({
                    [`stats.${statField}`]: firebase.firestore.FieldValue.increment(value),
                    lastActivity: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
        } catch (error) {
            console.error("Error updating user stats:", error);
        }
    }

    // Search Games
    async searchGames(query) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const results = SAMPLE_GAMES.filter(game => 
                    game.name.toLowerCase().includes(query.toLowerCase()) ||
                    game.genre.some(g => g.toLowerCase().includes(query.toLowerCase()))
                );
                resolve(results);
            }, 300);
        });
    }

    // Game Management
    async getGameById(gameId) {
        return SAMPLE_GAMES.find(game => game.id === parseInt(gameId));
    }

    async getFeaturedGames() {
        return SAMPLE_GAMES.slice(0, 3);
    }

    // Admin game management
    async getAllGamesFromDB() {
        return SAMPLE_GAMES;
    }

    async addGameToDB(gameData) {
        try {
            if (this.db) {
                const gameRef = await this.db.collection('games').add({
                    ...gameData,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    addedBy: auth.currentUser.uid
                });
                return gameRef.id;
            } else {
                // For demo purposes
                const newId = Math.max(...SAMPLE_GAMES.map(g => g.id)) + 1;
                SAMPLE_GAMES.push({
                    ...gameData,
                    id: newId,
                    image: "🎮"
                });
                return newId;
            }
        } catch (error) {
            console.error("Error adding game to DB:", error);
            return null;
        }
    }
}

const gameDB = new GamePulseDB();