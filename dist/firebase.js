import admin from 'firebase-admin';
export function initializeFirebase(firebaseConfigBase64) {
    if (!firebaseConfigBase64) {
        throw new Error('FIREBASE_CONFIG is not set in environment variables.');
    }
    const firebaseConfig = JSON.parse(Buffer.from(firebaseConfigBase64, 'base64').toString('utf8'));
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(firebaseConfig),
            databaseURL: firebaseConfig.databaseURL,
        });
    }
    return admin.app();
}
//# sourceMappingURL=firebase.js.map