import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/apiClient';

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    phone?: string;
    dob?: string;
    gender?: string;
    bloodGroup?: string;
    height?: string;
    weight?: string;
    allergies?: string;
    diseases?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    hasSeenOnboarding: boolean;
    login: (token: string, userData: User) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (updatedData: Partial<User>) => Promise<void>;
    completeOnboarding: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

    useEffect(() => {
        const loadStoredAuth = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('auth_token');
                const storedUser = await AsyncStorage.getItem('auth_user');
                const onboardingSeen = await AsyncStorage.getItem('onboarding_seen');

                if (storedToken && storedUser) {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                }
                if (onboardingSeen === 'true') {
                    setHasSeenOnboarding(true);
                }
            } catch (error) {
                console.error('Failed to load auth data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadStoredAuth();
    }, []);

    const completeOnboarding = async () => {
        try {
            await AsyncStorage.setItem('onboarding_seen', 'true');
            setHasSeenOnboarding(true);
        } catch (error) {
            console.error('Failed to save onboarding status:', error);
        }
    };

    const login = async (newToken: string, userData: User) => {
        try {
            await AsyncStorage.setItem('auth_token', newToken);
            await AsyncStorage.setItem('auth_user', JSON.stringify(userData));
            setToken(newToken);
            setUser(userData);
        } catch (error) {
            console.error('Failed to save auth data:', error);
            throw error;
        }
    };

    const updateUser = async (updatedData: Partial<User>) => {
        try {
            if (user) {
                const newUserData = { ...user, ...updatedData };
                await AsyncStorage.setItem('auth_user', JSON.stringify(newUserData));
                setUser(newUserData);
            }
        } catch (error) {
            console.error('Failed to update user data:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            // Call backend logout API
            await apiClient.post('/api/auth/logout', { role: 'PATIENT' });
        } catch (error) {
            console.error('Backend logout failed:', error);
        } finally {
            try {
                // Always clear local storage and state even if API fails
                await AsyncStorage.removeItem('auth_token');
                await AsyncStorage.removeItem('auth_user');
                setToken(null);
                setUser(null);
            } catch (error) {
                console.error('Failed to clear auth data:', error);
            }
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, hasSeenOnboarding, login, logout, updateUser, completeOnboarding }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
