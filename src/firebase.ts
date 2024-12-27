import * as admin from "firebase-admin";

interface FirebaseLibraryOptions {
  firebaseConfig: admin.ServiceAccount;
}

export class FirebaseAuthLibrary {
  constructor(options: FirebaseLibraryOptions) {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(options.firebaseConfig),
      });
    }
  }

  public async verifyToken(token: string): Promise<admin.auth.DecodedIdToken> {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      return decodedToken;
    } catch (error) {
      throw new Error("Invalid or expired token");
    }
  }
}