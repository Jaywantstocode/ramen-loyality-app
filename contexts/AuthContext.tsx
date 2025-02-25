'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { api } from '../lib/api/mutator/custom-instance';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: any | null;
  loading: boolean;
  profileLoading: boolean; // プロファイル読み込み状態を分離
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name?: string, phone?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false); // プロファイル読み込み状態を分離
  const [profileFetchAttempted, setProfileFetchAttempted] = useState(false); // プロファイル取得試行フラグ
  const router = useRouter();

  // refreshProfileをuseCallbackでメモ化して、依存関係の循環を防ぐ
  const refreshProfile = useCallback(async () => {
    if (!session || profileLoading || !user) return;
    
    // すでにプロファイルがあり、かつ再取得が不要な場合はスキップ
    if (profile && profile.id && !profileFetchAttempted) return;
    
    try {
      setProfileLoading(true);
      setProfileFetchAttempted(true);
      
      const response = await api.get('/auth/me');
      if (response.data) {
        setProfile(response.data);
      }
    } catch (error) {
      console.error('プロフィール取得エラー:', error);
    } finally {
      setProfileLoading(false);
    }
  }, [session, user, profile, profileLoading, profileFetchAttempted]);

  // 初期化時と認証状態変更時の処理
  useEffect(() => {
    let mounted = true;
    
    // 初期セッションの取得
    const initializeAuth = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          // セッションがある場合のみプロファイル取得を試みる
          if (session && !profile) {
            setProfileFetchAttempted(false); // 初期化時はフラグをリセット
          }
        }
      } catch (error) {
        console.error('認証初期化エラー:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    
    initializeAuth();
    
    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session) {
          setProfile(null);
          setProfileFetchAttempted(false);
        }
      }
    });
    
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [profile]);

  // セッションが変更されたときにプロファイルを取得
  useEffect(() => {
    if (session && user && !profileLoading && !profile) {
      refreshProfile();
    }
  }, [session, user, profile, profileLoading, refreshProfile]);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Supabaseで認証
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) return { error };
      
      if (data.session) {
        setSession(data.session);
        setUser(data.user);
        setProfileFetchAttempted(false);
        
        // バックエンドにもサインイン
        await api.post('/auth/signin', {
          email,
          supabaseId: data.user.id,
        });
      }
      
      return { error: null };
    } catch (error) {
      console.error('ログインエラー:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name?: string, phone?: string) => {
    setLoading(true);
    try {
      // Supabaseで認証
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) return { error };
      
      // バックエンドでユーザー作成
      if (data.user) {
        await api.post('/auth/signup', {
          email,
          name,
          phone,
          supabaseId: data.user.id,
        });
      }
      
      return { error: null };
    } catch (error) {
      console.error('アカウント作成エラー:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      if (session) {
        await api.post('/auth/signout');
      }
      await supabase.auth.signOut();
      setProfile(null);
      setProfileFetchAttempted(false);
    } catch (error) {
      console.error('ログアウトエラー:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    session,
    user,
    profile,
    loading,
    profileLoading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthはAuthProviderの中で使用する必要があります');
  }
  return context;
} 