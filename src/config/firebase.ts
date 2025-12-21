import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';

// Firebase configuration
// Bu değerler environment variable'lardan okunmalı
// NOT: .env dosyasında yorum (#) veya boşluk olmamalı!

const cleanEnvValue = (value: string | undefined): string => {
    if (!value) return '';
    // Başındaki ve sonundaki boşlukları temizle
    // # ile başlayan yorumları temizle
    return value.trim().split('#')[0].trim();
};

const firebaseConfig = {
    apiKey: cleanEnvValue(process.env.REACT_APP_FIREBASE_API_KEY) || '',
    authDomain: cleanEnvValue(process.env.REACT_APP_FIREBASE_AUTH_DOMAIN) ||
        (process.env.REACT_APP_FIREBASE_PROJECT_ID ? `${cleanEnvValue(process.env.REACT_APP_FIREBASE_PROJECT_ID)}.web.app` : ''),
    projectId: cleanEnvValue(process.env.REACT_APP_FIREBASE_PROJECT_ID) || '',
    storageBucket: cleanEnvValue(process.env.REACT_APP_FIREBASE_STORAGE_BUCKET) || '',
    messagingSenderId: cleanEnvValue(process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID) || '',
    appId: cleanEnvValue(process.env.REACT_APP_FIREBASE_APP_ID) || '',
};

// Validate required configuration
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error('⚠️ Firebase configuration is missing required fields (apiKey, projectId)');
    console.error('⚠️ Please create a .env file with REACT_APP_FIREBASE_API_KEY and REACT_APP_FIREBASE_PROJECT_ID');
    console.error('⚠️ See .env.example for reference');
    console.error('⚠️ Current config:', {
        apiKey: firebaseConfig.apiKey ? '***' + firebaseConfig.apiKey.slice(-4) : 'MISSING',
        projectId: firebaseConfig.projectId || 'MISSING',
        authDomain: firebaseConfig.authDomain || 'MISSING'
    });
} else {
    console.log('✅ Firebase config loaded:', {
        apiKey: '***' + firebaseConfig.apiKey.slice(-4),
        projectId: firebaseConfig.projectId,
        authDomain: firebaseConfig.authDomain
    });
}

// Initialize Firebase (only if not already initialized)
let app: FirebaseApp;
if (getApps().length === 0) {
    try {
        app = initializeApp(firebaseConfig);
        console.log('Firebase initialized successfully');
    } catch (error) {
        console.error('Firebase initialization error:', error);
        throw error;
    }
} else {
    app = getApps()[0];
}

// Initialize Auth
export const auth: Auth = getAuth(app);

// Configure auth settings
auth.languageCode = 'tr'; // Türkçe dil desteği

export default app;


