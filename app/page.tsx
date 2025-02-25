"use client"

import { useEffect, useState } from 'react';
import ProtectedLayout from '../components/ProtectedLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Gift, History } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Home() {
  const { profile, signOut, session, profileLoading } = useAuth();
  const router = useRouter();
  const [showQR, setShowQR] = useState(false);
  const [qrValue, setQrValue] = useState('');

  // QRコードの値を設定
  useEffect(() => {
    if (session?.user?.id) {
      setQrValue(`ramen-loyalty:${session.user.id}`);
    }
  }, [session]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const toggleQRCode = () => {
    setShowQR(!showQR);
  };

  return (
    <ProtectedLayout>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">麺ポイント</h1>
            <button
              onClick={handleSignOut}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              ログアウト
            </button>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* QRコード表示モーダル */}
            {showQR && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                  <h3 className="text-xl font-bold mb-4 text-center">あなたのポイント獲得用QRコード</h3>
                  <div className="flex justify-center mb-4">
                    <QRCodeSVG value={qrValue} size={250} />
                  </div>
                  <p className="text-sm text-gray-600 mb-4 text-center">
                    このQRコードをスタッフに見せてポイントを獲得しましょう
                  </p>
                  <div className="flex justify-center">
                    <Button onClick={toggleQRCode}>閉じる</Button>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                {profileLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold">現在のポイント</h2>
                      <p className="text-5xl font-bold text-orange-600 mt-2">{profile?.totalPoints || 0} pt</p>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <QrCode className="mr-2 h-5 w-5" />
                            QRコード
                          </CardTitle>
                          <CardDescription>ポイント獲得用QRコード</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button className="w-full" onClick={toggleQRCode}>
                            表示する
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Gift className="mr-2 h-5 w-5" />
                            特典交換
                          </CardTitle>
                          <CardDescription>ポイントを特典と交換</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button className="w-full" asChild>
                            <Link href="/rewards">特典を見る</Link>
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <History className="mr-2 h-5 w-5" />
                            履歴
                          </CardTitle>
                          <CardDescription>ポイント履歴を確認</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Button className="w-full" asChild>
                            <Link href="/history">履歴を見る</Link>
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="text-lg font-medium">アカウント情報</h3>
                      <div className="mt-5 border-t border-gray-200">
                        <dl className="divide-y divide-gray-200">
                          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                            <dt className="text-sm font-medium text-gray-500">名前</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile?.name || '未設定'}</dd>
                          </div>
                          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                            <dt className="text-sm font-medium text-gray-500">メールアドレス</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile?.email || '未設定'}</dd>
                          </div>
                          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                            <dt className="text-sm font-medium text-gray-500">電話番号</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile?.phone || '未設定'}</dd>
                          </div>
                          <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                            <dt className="text-sm font-medium text-gray-500">合計ポイント</dt>
                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile?.totalPoints || 0} pt</dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedLayout>
  );
}

