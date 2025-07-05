import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mission } from "@/types/mission";
import { initialMissions } from "@/data/missions";

const MemberMission = () => {
  const [missions, setMissions] = useState<Mission[]>(initialMissions);
  const [participatedMissions, setParticipatedMissions] = useState<Set<string>>(new Set());

  const handleParticipate = (missionId: string) => {
    setMissions((prevMissions) =>
      prevMissions.map((mission) =>
        mission.id === missionId ? { ...mission, participants: mission.participants + 1 } : mission,
      ),
    );
    setParticipatedMissions((prev) => new Set([...prev, missionId]));
  };

  const getStatusColor = (status: Mission["status"]) => {
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

  const getTypeColor = (type: Mission["type"]) => {
    switch (type) {
      case "daily":
        return "bg-yellow-100 text-yellow-800";
      case "weekly":
        return "bg-purple-100 text-purple-800";
      case "monthly":
        return "bg-indigo-100 text-indigo-800";
      case "special":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isParticipated = (missionId: string) => {
    return participatedMissions.has(missionId);
  };

  const canParticipate = (mission: Mission) => {
    if (mission.status !== "active") return false;
    if (isParticipated(mission.id)) return false;
    if (mission.maxParticipants && mission.participants >= mission.maxParticipants) return false;
    return true;
  };

  const filteredMissions = missions.filter((mission) => mission.status !== "completed");

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">미션</h1>
            <p className="text-sm text-gray-600">다양한 미션에 참여하고 보상을 받아보세요!</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">참여한 미션: {participatedMissions.size}개</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMissions.map((mission) => (
            <Card key={mission.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {mission.name}
                    </CardTitle>
                    <p className="mt-2 line-clamp-2 text-sm text-gray-600">{mission.description}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <Badge className={getTypeColor(mission.type)}>
                    {mission.type === "daily" && "일일"}
                    {mission.type === "weekly" && "주간"}
                    {mission.type === "monthly" && "월간"}
                    {mission.type === "special" && "특별"}
                  </Badge>
                  <Badge className={getStatusColor(mission.status)}>
                    {mission.status === "active" && "진행중"}
                    {mission.status === "inactive" && "비활성"}
                    {mission.status === "completed" && "완료"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">참여자</span>
                    <span className="font-medium">
                      {mission.participants}
                      {mission.maxParticipants && ` / ${mission.maxParticipants}`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">보상</span>
                    <span className="font-medium text-green-600">{mission.reward}</span>
                  </div>

                  {mission.maxParticipants && (
                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                        style={{
                          width: `${Math.min((mission.participants / mission.maxParticipants) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  )}

                  <div className="pt-2">
                    {isParticipated(mission.id) ? (
                      <Button className="w-full bg-green-600 hover:bg-green-700" disabled>
                        참여 완료
                      </Button>
                    ) : canParticipate(mission) ? (
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleParticipate(mission.id)}
                      >
                        미션 참여
                      </Button>
                    ) : (
                      <Button className="w-full bg-gray-400 hover:bg-gray-500" disabled>
                        {mission.status === "inactive" && "비활성"}
                        {mission.maxParticipants &&
                          mission.participants >= mission.maxParticipants &&
                          "참여 마감"}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMissions.length === 0 && (
          <Card>
            <CardContent className="flex items-center justify-center p-8">
              <div className="text-center">
                <p className="mb-2 text-lg font-medium text-gray-600">
                  현재 참여 가능한 미션이 없습니다
                </p>
                <p className="text-sm text-gray-500">새로운 미션이 추가될 때까지 기다려주세요.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MemberMission;
