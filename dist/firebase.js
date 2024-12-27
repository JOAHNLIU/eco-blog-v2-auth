"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeFirebase = initializeFirebase;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
function initializeFirebase(firebaseConfigBase64) {
    if (!firebaseConfigBase64) {
        throw new Error('FIREBASE_CONFIG is not set in environment variables.');
    }
    const firebaseConfig = JSON.parse(Buffer.from(firebaseConfigBase64, 'base64').toString('utf8'));
    if (!firebase_admin_1.default.apps.length) {
        firebase_admin_1.default.initializeApp({
            credential: firebase_admin_1.default.credential.cert(firebaseConfig),
            databaseURL: firebaseConfig.databaseURL,
        });
    }
    return firebase_admin_1.default.app();
}
//# sourceMappingURL=firebase.js.map