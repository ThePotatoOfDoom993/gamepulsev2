// config.js - Configuration files with owner account

// Firebase Configuration
const firebaseConfig = {
    apiKey: "your-firebase-api-key-here",
    authDomain: "gamepulse-your-project.firebaseapp.com",
    projectId: "gamepulse-your-project",
    storageBucket: "gamepulse-your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-firebase-app-id"
};

// Gemini AI Configuration - YOUR API KEY HERE
const GEMINI_API_KEY = "AIzaSyAI7El96qCvHloLspzVk7haX53SxWRdtsY";

// Pre-configured Owner Account
const OWNER_ACCOUNT = {
    email: "aterrealms@gmail.com",
    password: "minecraftplayer961400",
    displayName: "GamePulse Owner",
    role: "owner"
};

// Role Definitions
const ROLES = {
    GAMER: 'gamer',
    CONTENT_CREATOR: 'content-creator', 
    TEACHER: 'teacher',
    ADMIN: 'admin',
    OWNER: 'owner'
};

// Role Permissions
const ROLE_PERMISSIONS = {
    [ROLES.GAMER]: ['view_games', 'track_games', 'view_community', 'use_ai'],
    [ROLES.CONTENT_CREATOR]: ['view_games', 'track_games', 'create_content', 'view_analytics', 'use_ai'],
    [ROLES.TEACHER]: ['view_games', 'track_games', 'create_lessons', 'manage_students', 'use_ai'],
    [ROLES.ADMIN]: ['view_games', 'track_games', 'manage_users', 'manage_content', 'view_analytics', 'platform_settings', 'use_ai'],
    [ROLES.OWNER]: ['all']
};

// Role Display Names
const ROLE_DISPLAY_NAMES = {
    [ROLES.GAMER]: 'Gamer',
    [ROLES.CONTENT_CREATOR]: 'Content Creator',
    [ROLES.TEACHER]: 'Teacher',
    [ROLES.ADMIN]: 'Administrator',
    [ROLES.OWNER]: 'Owner'
};

// Role Colors for UI
const ROLE_COLORS = {
    [ROLES.GAMER]: '#667eea',
    [ROLES.CONTENT_CREATOR]: '#ed64a6', 
    [ROLES.TEACHER]: '#48bb78',
    [ROLES.ADMIN]: '#f56565',
    [ROLES.OWNER]: '#9f7aea'
};

// Sample game data
const SAMPLE_GAMES = [
    {
        id: 1,
        name: "The Witcher 3: Wild Hunt",
        genre: ["RPG", "Action", "Adventure"],
        rating: 4.9,
        description: "An open-world RPG set in a fantasy universe with incredible storytelling and gameplay.",
        image: "🎮"
    },
    {
        id: 2,
        name: "Counter-Strike 2",
        genre: ["FPS", "Action", "Multiplayer"],
        rating: 4.7,
        description: "Tactical team-based first-person shooter with competitive gameplay.",
        image: "🔫"
    },
    {
        id: 3,
        name: "Stardew Valley",
        genre: ["Simulation", "RPG", "Indie"],
        rating: 4.8,
        description: "Relaxing farm simulation role-playing game with endless possibilities.",
        image: "🌱"
    },
    {
        id: 4,
        name: "Minecraft",
        genre: ["Sandbox", "Adventure", "Indie"],
        rating: 4.8,
        description: "Creative sandbox game where you build and explore infinite worlds.",
        image: "🧱"
    },
    {
        id: 5,
        name: "Cyberpunk 2077",
        genre: ["RPG", "Action", "Sci-fi"],
        rating: 4.6,
        description: "Open-world RPG set in a dystopian future with deep character customization.",
        image: "🔮"
    }
];

// Platform Settings
const PLATFORM_SETTINGS = {
    MAX_GAMES_PER_USER: 1000,
    MAX_CONTENT_PER_CREATOR: 500,
    MAX_STUDENTS_PER_TEACHER: 100,
    AI_USAGE_LIMIT: 100
};