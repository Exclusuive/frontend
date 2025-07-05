import React, { useState } from "react";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Eye, Users, Calendar, Target } from "lucide-react";
import AddMission, { MissionForm } from "@/components/AddMission";
import { useCollectionStore } from "@/stores/useCollectionStore";
import { Mission } from "@/types/mission";

const AdminMission: React.FC = () => {
  // 전역 컬렉션 상태
  const { collection, addMission, updateMission, deleteMission, toggleMissionStatus } =
    useCollectionStore();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingMission, setEditingMission] = useState<Mission | null>(null);
  const [activeTab, setActiveTab] = useState<string>("all");
  // 미션 추가
  const onAddMission = (data: MissionForm) => {
    if (!collection) return;
    const newMission: Mission = {
      id: Date.now().toString(),
      name: data.name,
      description: data.description,
      type: data.type,
      status: data.status,
      participants: 0,
      maxParticipants: data.maxParticipants ? parseInt(data.maxParticipants) : undefined,
      reward: data.reward,
      createdAt: new Date().toISOString().split("T")[0],
    };
    addMission(newMission);
    setIsAddDialogOpen(false);
  };

  // 미션 편집
  const onEditMission = (data: MissionForm) => {
    if (!collection || !editingMission) return;
    const updatedMission: Mission = {
      ...editingMission,
      name: data.name,
      description: data.description,
      type: data.type,
      status: data.status,
      maxParticipants: data.maxParticipants ? parseInt(data.maxParticipants) : undefined,
      reward: data.reward,
    };
    updateMission(updatedMission);
    setIsEditDialogOpen(false);
    setEditingMission(null);
  };

  // 미션 삭제
  const handleDeleteMission = (id: string) => {
    if (!collection) return;
    deleteMission(id);
  };

  // 미션 상태 토글
  const handleToggleStatus = (id: string) => {
    if (!collection) return;
    toggleMissionStatus(id);
  };

  // 편집 대화상자 열기
  const openEditDialog = (mission: Mission) => {
    setEditingMission(mission);
    setIsEditDialogOpen(true);
  };

  // 필터링된 미션
  const filteredMissions =
    collection?.missions ||
    [].filter((mission: Mission) => {
      if (activeTab === "all") return true;
      if (activeTab === "active") return mission.status === "active";
      if (activeTab === "inactive") return mission.status === "inactive";
      if (activeTab === "completed") return mission.status === "completed";
      return true;
    });

  // 타입별 배지 색상
  const getTypeBadgeColor = (type: Mission["type"]) => {
    switch (type) {
      case "daily":
        return "bg-blue-100 text-blue-800";
      case "weekly":
        return "bg-green-100 text-green-800";
      case "monthly":
        return "bg-purple-100 text-purple-800";
      case "special":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // 상태별 배지 색상
  const getStatusBadgeColor = (status: Mission["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex h-full flex-col p-6">
      {/* 헤더 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">미션 관리</h1>
        <p className="text-gray-600">사용자 미션을 생성하고 관리하세요.</p>
      </div>

      {/* 통계 카드 */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">전체 미션</p>
                <p className="text-2xl font-bold text-gray-900">{collection?.missions?.length}</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">활성 미션</p>
                <p className="text-2xl font-bold text-green-600">
                  {collection?.missions?.filter((m) => m.status === "active").length}
                </p>
              </div>
              <Eye className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">총 참여자</p>
                <p className="text-2xl font-bold text-purple-600">
                  {collection?.missions?.reduce((sum, m) => sum + m.participants, 0)}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">완료된 미션</p>
                <p className="text-2xl font-bold text-orange-600">
                  {collection?.missions?.filter((m) => m.status === "completed").length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 메인 컨텐츠 */}
      <Card className="flex-1">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>미션 목록</CardTitle>
            <Button
              className="bg-blue-500 hover:bg-blue-600"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              미션 추가
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>새 미션 추가</DialogTitle>
                  <DialogDescription>새로운 미션을 생성하고 설정하세요.</DialogDescription>
                </DialogHeader>
                <AddMission
                  onSubmit={onAddMission}
                  mode="add"
                  onCancel={() => setIsAddDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* 탭 */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
            <TabsList>
              <TabsTrigger value="all">전체 ({collection?.missions?.length})</TabsTrigger>
              <TabsTrigger value="active">
                활성 ({collection?.missions?.filter((m) => m.status === "active").length})
              </TabsTrigger>
              <TabsTrigger value="inactive">
                비활성 ({collection?.missions?.filter((m) => m.status === "inactive").length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                완료 ({collection?.missions?.filter((m) => m.status === "completed").length})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* 테이블 */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">미션명</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">타입</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">상태</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">
                    참여자
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">보상</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-600">액션</th>
                </tr>
              </thead>
              <tbody>
                {filteredMissions.map((mission) => (
                  <tr key={mission.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{mission.name}</p>
                        <p className="max-w-xs truncate text-sm text-gray-600">
                          {mission.description}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <Badge className={`${getTypeBadgeColor(mission.type)}`}>
                        {mission.type === "daily"
                          ? "데일리"
                          : mission.type === "weekly"
                            ? "위클리"
                            : mission.type === "monthly"
                              ? "먼슬리"
                              : "특별"}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <Badge className={`${getStatusBadgeColor(mission.status)}`}>
                        {mission.status === "active"
                          ? "활성"
                          : mission.status === "inactive"
                            ? "비활성"
                            : "완료"}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="text-sm">
                        <span className="font-medium">{mission.participants}</span>
                        {mission.maxParticipants && (
                          <span className="text-gray-500">/{mission.maxParticipants}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium text-gray-900">{mission.reward}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleStatus(mission.id)}
                          className="h-8 px-2"
                        >
                          {mission.status === "active" ? "비활성화" : "활성화"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(mission)}
                          className="h-8 px-2"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteMission(mission.id)}
                          className="h-8 px-2 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredMissions.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-500">해당 조건의 미션이 없습니다.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 편집 대화상자 */}
      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) setEditingMission(null);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>미션 편집</DialogTitle>
            <DialogDescription>미션 정보를 수정하세요.</DialogDescription>
          </DialogHeader>
          <AddMission
            onSubmit={onEditMission}
            mode="edit"
            initialValues={
              editingMission
                ? {
                    name: editingMission.name,
                    description: editingMission.description,
                    type: editingMission.type,
                    status: editingMission.status,
                    maxParticipants: editingMission.maxParticipants?.toString() || "",
                    reward: editingMission.reward,
                  }
                : undefined
            }
            onCancel={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMission;
