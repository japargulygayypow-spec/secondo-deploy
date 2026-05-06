import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '@/lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const initAuth = async () => {
        if (authApi.isAuthenticated()) {
            try {
                const profile = await authApi.getProfile();
                setUser(profile);
            } catch (error) {
                console.error('Failed to load profile', error);
                authApi.logout(); // Token might be invalid
                setUser(null);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        initAuth();
    }, []);

    const login = async (credentials) => {
        const { data, ok } = await authApi.login(credentials);
        if (ok) {
            // After login, fetch profile to update user state
            try {
                const profile = await authApi.getProfile();
                setUser(profile);
                return { ok: true };
            } catch (e) {
                return { ok: false, error: 'Failed to load profile' };
            }
        }
        return { ok: false, error: data.detail || 'Login failed' };
    };

    const logout = () => {
        authApi.logout();
        setUser(null);
        window.location.href = '/'; // Redirect to home
    };

    const register = async (userData) => {
        try {
            const response = await authApi.register(userData);
            // Assuming register does NOT automatically login, but returns success
            // You might want to auto-login here
            return { ok: true, data: response };
        } catch (e) {
            return { ok: false, error: e.message };
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
