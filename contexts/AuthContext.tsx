'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, PlanType } from '@/lib/types';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (email: string, password: string, name: string) => Promise<void>;
    logout: () => void;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    // 사용자의 DB 프로필 데이터를 가져오는 함수
    const fetchUserProfile = async (userId: string, email: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.warn('Error fetching profile from DB:', error);
                // 에러가 발생해도 (예: 트리거 지연, RLS 등) 로그인은 가능하도록 폴백 데이터 반환
                return {
                    id: userId,
                    email: email,
                    name: email.split('@')[0],
                    plan: 'FREE' as PlanType,
                    createdAt: new Date(),
                    usage: { current: 0, limit: 10 }
                };
            }

            if (data) {
                return {
                    id: data.id,
                    email: data.email,
                    name: data.name || '',
                    plan: (data.plan as PlanType) || 'FREE',
                    createdAt: new Date(data.created_at || Date.now()),
                    usage: {
                        current: data.usage_current || 0,
                        limit: data.usage_limit || 10,
                    },
                };
            } else {
                console.warn('Profile data is null for user:', userId);
                return {
                    id: userId,
                    email: email,
                    name: email.split('@')[0],
                    plan: 'FREE' as PlanType,
                    createdAt: new Date(),
                    usage: { current: 0, limit: 10 }
                };
            }
        } catch (error) {
            console.error('Profile fetch error:', error);
            return null;
        }
    };

    useEffect(() => {
        // 초기 세션 확인
        const initAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                const profile = await fetchUserProfile(session.user.id, session.user.email!);
                setUser(profile);
            }
            setIsLoading(false);
        };

        initAuth();

        // 인증 상태 변경 감지
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth state changed:', event, session?.user?.id);

            if (session?.user) {
                try {
                    const profile = await fetchUserProfile(session.user.id, session.user.email!);
                    setUser(profile);
                } catch (err) {
                    console.error('Error in onAuthStateChange profile fetch:', err);
                }
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const login = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
    };

    const signup = async (email: string, password: string, name: string) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                },
            },
        });
        if (error) throw error;
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        router.push('/');
    };

    const refreshProfile = async () => {
        if (user) {
            const profile = await fetchUserProfile(user.id, user.email);
            setUser(profile);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                login,
                signup,
                logout,
                refreshProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
