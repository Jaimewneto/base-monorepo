import {
    login,
    me,
    refreshToken,
    resetPassword,
    sendPasswordResetLink,
} from "../auth.js";

export const authController = {
    login,
    me,
    sendPasswordResetLink,
    refreshToken,
    resetPassword,
};
