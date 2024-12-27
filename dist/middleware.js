var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import admin from 'firebase-admin';
export const verifyTokenMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    const isOptional = req.method === 'GET';
    if (!token) {
        if (isOptional) {
            req.userId = null;
            next();
            return;
        }
        res.status(401).json({ error: 'Token not provided' });
        return;
    }
    try {
        const decodedToken = yield admin.auth().verifyIdToken(token);
        req.userId = decodedToken.uid;
    }
    catch (error) {
        console.error('Token verification failed:', error);
        if (!isOptional) {
            res.status(401).json({ error: 'Invalid token' });
            return;
        }
        req.userId = null;
    }
    next();
});
//# sourceMappingURL=middleware.js.map