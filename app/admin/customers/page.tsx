"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Search, Edit, UserPlus, Star, Download, Filter } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import LoadingSpinner from "@/components/LoadingSpinner"
import { useUsersControllerFindAll } from "@/lib/api/generated/users/users"
import { useUsersControllerUpdate } from "@/lib/api/generated/users/users"

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editedCustomer, setEditedCustomer] = useState<any | null>(null)

  // 生成されたAPIフックを使用
  const { data: customers, error, isLoading, mutate } = useUsersControllerFindAll()
  const { trigger: updateUser, isMutating } = useUsersControllerUpdate(
    selectedCustomer?.id || 0
  )

  // Filter customers based on search term
  const filteredCustomers = Array.isArray(customers) 
    ? customers.filter(customer => 
        customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer?.phone?.includes(searchTerm)
      )
    : [];

  // Handle customer selection
  const handleSelectCustomer = (customer: any) => {
    setSelectedCustomer(customer)
    setEditedCustomer({...customer})
    setIsDialogOpen(true)
    setIsEditMode(false)
  }

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditMode(!isEditMode)
  }

  // Handle save changes
  const handleSaveChanges = async () => {
    if (!editedCustomer || !selectedCustomer?.id) return
    
    try {
      await updateUser({
        name: editedCustomer.name,
        email: editedCustomer.email,
        phone: editedCustomer.phone,
        // totalPointsは直接更新できないため除外
      })
      
      // 成功したら顧客リストを再取得
      mutate()
      
      setSelectedCustomer(editedCustomer)
      setIsEditMode(false)
      toast.success("顧客情報を更新しました")
    } catch (error) {
      console.error("Error updating customer:", error)
      toast.error("顧客情報の更新に失敗しました")
    }
  }

  // Get membership level based on points
  const getMembershipLevel = (points: number) => {
    if (points >= 1000) return "ゴールド"
    if (points >= 500) return "シルバー"
    return "ブロンズ"
  }

  if (error) {
    toast.error("顧客データの取得に失敗しました")
  }

  return (
    <div className="space-y-6 px-4 py-6 max-w-7xl mx-auto">
      <div className="flex items-center">
        <Link href="/admin" className="mr-4">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">顧客管理</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>顧客一覧</CardTitle>
          <CardDescription>
            すべての顧客情報を管理します
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="名前、メール、電話番号で検索..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              新規顧客
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              エクスポート
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>名前</TableHead>
                    <TableHead>メールアドレス</TableHead>
                    <TableHead>ポイント</TableHead>
                    <TableHead>会員レベル</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>{customer.name || '未設定'}</TableCell>
                        <TableCell>{customer.email}</TableCell>
                        <TableCell>{customer.totalPoints || 0}</TableCell>
                        <TableCell>
                          <Badge variant={
                            customer.totalPoints >= 1000 ? "default" : 
                            customer.totalPoints >= 500 ? "secondary" : 
                            "outline"
                          }>
                            {getMembershipLevel(customer.totalPoints || 0)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleSelectCustomer(customer)}
                          >
                            詳細
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                        {searchTerm ? "検索条件に一致する顧客が見つかりません" : "顧客データがありません"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>顧客詳細</DialogTitle>
          </DialogHeader>
          
          {selectedCustomer && (
            <Tabs defaultValue="info">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="info">基本情報</TabsTrigger>
                <TabsTrigger value="visits">来店履歴</TabsTrigger>
                <TabsTrigger value="rewards">特典履歴</TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="mt-4">
                {isEditMode ? (
                  // Edit Form
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">名前</label>
                      <Input 
                        value={editedCustomer?.name} 
                        onChange={(e) => setEditedCustomer({...editedCustomer!, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">メールアドレス</label>
                      <Input 
                        value={editedCustomer?.email} 
                        onChange={(e) => setEditedCustomer({...editedCustomer!, email: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">電話番号</label>
                      <Input 
                        value={editedCustomer?.phone} 
                        onChange={(e) => setEditedCustomer({...editedCustomer!, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">ポイント</label>
                      <Input 
                        type="number"
                        value={editedCustomer?.totalPoints} 
                        onChange={(e) => setEditedCustomer({...editedCustomer!, totalPoints: parseInt(e.target.value)})}
                        disabled={true} // ポイントは直接編集不可
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <label className="text-sm font-medium">メモ</label>
                      <Input 
                        value={editedCustomer?.notes} 
                        onChange={(e) => setEditedCustomer({...editedCustomer!, notes: e.target.value})}
                      />
                    </div>
                  </div>
                ) : (
                  // Display Info
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">名前</p>
                      <p className="font-medium">{selectedCustomer.name || '未設定'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">会員レベル</p>
                      <p className="font-medium">{getMembershipLevel(selectedCustomer.totalPoints)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">メールアドレス</p>
                      <p className="font-medium">{selectedCustomer.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">電話番号</p>
                      <p className="font-medium">{selectedCustomer.phone || '未設定'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">保有ポイント</p>
                      <p className="font-medium">{selectedCustomer.totalPoints}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">会員登録日</p>
                      <p className="font-medium">{new Date(selectedCustomer.createdAt).toLocaleDateString('ja-JP')}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">メモ</p>
                      <p className="font-medium">{selectedCustomer.notes || "なし"}</p>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="visits" className="mt-4">
                <div className="text-center py-8 text-muted-foreground">
                  来店履歴データはまだ実装されていません
                </div>
              </TabsContent>
              
              <TabsContent value="rewards" className="mt-4">
                <div className="text-center py-8 text-muted-foreground">
                  特典履歴データはまだ実装されていません
                </div>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            {isEditMode ? (
              <>
                <Button variant="outline" onClick={() => setIsEditMode(false)} disabled={isMutating}>
                  キャンセル
                </Button>
                <Button onClick={handleSaveChanges} disabled={isMutating}>
                  {isMutating ? "保存中..." : "保存"}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  閉じる
                </Button>
                <Button onClick={toggleEditMode}>
                  <Edit className="h-4 w-4 mr-2" />
                  編集
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 