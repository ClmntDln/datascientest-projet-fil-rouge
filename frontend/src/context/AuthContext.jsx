import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiFetch } from '../api/client';

const AuthContext = createContext(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchMe = useCallback(async () => {
        try {
            const me = await apiFetch('/auth/me/', { auth: true });
            setUser(me);
            return me;
        } catch {
            setUser(null);
            return null;
        }
    }, []);

    useEffect(() => {
        (async () => {
            await fetchMe();
            setLoading(false);
        })();
    }, [fetchMe]);

    const login = async (email, password) => {
        await apiFetch('/auth/login/', {
            method: 'POST',
            body: { email, password },
        });
        await fetchMe();
    };

    const signup = async (payload) => {
        return apiFetch('/auth/signup/', { method: 'POST', body: payload });
    };

    const logout = async () => {
        try {
            await apiFetch('/auth/logout/', { method: 'POST' });
        } catch {
            /* déconnexion locale même si l'API échoue */
        }
        setUser(null);
    };

    const exportAccount = () => apiFetch('/auth/me/export/', { auth: true });

    const deleteAccount = () => apiFetch('/auth/me/delete/', { method: 'DELETE', auth: true });

    const requestPasswordReset = async (email) => {
        return apiFetch('/auth/reset-password/request/', {
            method: 'POST',
            body: { email },
        });
    };

    const confirmPasswordReset = async (uid, token, newPassword) => {
        return apiFetch('/auth/reset-password/confirm/', {
            method: 'POST',
            body: { uid, token, new_password: newPassword },
        });
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            signup,
            logout,
            exportAccount,
            deleteAccount,
            requestPasswordReset,
            confirmPasswordReset,
            refresh: fetchMe,
        }}>
            {children}
        </AuthContext.Provider>
    );
};
