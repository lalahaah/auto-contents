'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Content, ContentType } from '@/lib/types';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from './AuthContext';

interface UserContextType {
    contents: Content[];
    isLoading: boolean;
    addContent: (content: Omit<Content, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => Promise<void>;
    updateContent: (id: string, updates: Partial<Content>) => Promise<void>;
    deleteContent: (id: string) => Promise<void>;
    getContentById: (id: string) => Content | undefined;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [contents, setContents] = useState<Content[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user, refreshProfile } = useAuth();

    // 콘텐츠 목록 불러오기
    const fetchContents = async () => {
        if (!user) {
            setContents([]);
            setIsLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('user_contents')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (data) {
                const formattedContents: Content[] = data.map(item => ({
                    id: item.id,
                    userId: item.user_id,
                    type: item.type as ContentType,
                    title: item.title,
                    content: item.content,
                    createdAt: new Date(item.created_at),
                    updatedAt: new Date(item.updated_at),
                    metadata: item.metadata,
                }));
                setContents(formattedContents);
            }
        } catch (error) {
            console.error('Error fetching contents:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchContents();
        } else {
            setContents([]);
        }
    }, [user]);

    const addContent = async (content: Omit<Content, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from('user_contents')
                .insert([
                    {
                        user_id: user.id,
                        type: content.type,
                        title: content.title,
                        content: content.content,
                        metadata: content.metadata || {},
                    },
                ])
                .select()
                .single();

            if (error) throw error;

            if (data) {
                const newContent: Content = {
                    id: data.id,
                    userId: data.user_id,
                    type: data.type as ContentType,
                    title: data.title,
                    content: data.content,
                    createdAt: new Date(data.created_at),
                    updatedAt: new Date(data.updated_at),
                    metadata: data.metadata,
                };
                setContents([newContent, ...contents]);

                // 사용량 업데이트는 DB Trigger(on_content_created)에 의해 자동 처리됩니다.
                // UI에 반영하기 위해 프로필 정보를 새로고침합니다.
                await refreshProfile();
            }
        } catch (error) {
            console.error('Error adding content:', error);
            throw error;
        }
    };

    const updateContent = async (id: string, updates: Partial<Content>) => {
        try {
            const { error } = await supabase
                .from('user_contents')
                .update({
                    title: updates.title,
                    content: updates.content,
                    metadata: updates.metadata,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', id);

            if (error) throw error;

            setContents(contents.map(c =>
                c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c
            ));
        } catch (error) {
            console.error('Error updating content:', error);
            throw error;
        }
    };

    const deleteContent = async (id: string) => {
        try {
            const { error } = await supabase
                .from('user_contents')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setContents(contents.filter(c => c.id !== id));
        } catch (error) {
            console.error('Error deleting content:', error);
            throw error;
        }
    };

    const getContentById = (id: string) => {
        return contents.find(c => c.id === id);
    };

    return (
        <UserContext.Provider
            value={{
                contents,
                isLoading,
                addContent,
                updateContent,
                deleteContent,
                getContentById,
            }}
        >
            {children}
        </UserContext.Provider>
    );
}

export function useUserContent() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUserContent must be used within a UserProvider');
    }
    return context;
}
