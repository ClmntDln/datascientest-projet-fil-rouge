import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiFetch, tokenStore } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchMe = useCallback(async () => {
        try {
            const me = await apiFetch('/auth/me/', { auth: true });
            setUser(me);
        } catch {
            setUser(null);
            tokenStore.clear();
        }
    }, []);

    useEffect(() => {
        (async () => {
            if (tokenStore.getAccess()) await fetchMe();
            setLoading(false);
        })();
    }, [fetchMe]);

    const login = async (email, password) => {
        const data = await apiFetch('/auth/login/', {
            method: 'POST',
            body: { email, password },
        });
        tokenStore.set(data.access, data.refresh);
        await fetchMe();
    };

    const signup = async (payload) => {
        return apiFetch('/auth/signup/', { method: 'POST', body: payload });
    };

    const logout = () => {
        tokenStore.clear();
        setUser(null);
    };

    const resetPassword = async (email, newPassword) => {
        return apiFetch('/auth/reset-password/', {
            method: 'POST',
            body: { email, new_password: newPassword },
        });
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, resetPassword, refresh: fetchMe }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
