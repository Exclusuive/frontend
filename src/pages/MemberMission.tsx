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

  const filteredMissions = missions.filter((mission) => mission.status !== "inactive");

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Missions</h1>
            <p className="text-sm text-gray-600">
              Participate in various missions and earn rewards!
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Missions Participated: {participatedMissions.size}</Badge>
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
                    {mission.type === "daily" && "Daily"}
                    {mission.type === "weekly" && "Weekly"}
                    {mission.type === "monthly" && "Monthly"}
                    {mission.type === "special" && "Special"}
                  </Badge>
                  <Badge className={getStatusColor(mission.status)}>
                    {mission.status === "active" && "Active"}
                    {mission.status === "inactive" && "Inactive"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Participants</span>
                    <span className="font-medium">
                      {mission.participants}
                      {mission.maxParticipants && ` / ${mission.maxParticipants}`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Reward</span>
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
                        Participated
                      </Button>
                    ) : canParticipate(mission) ? (
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleParticipate(mission.id)}
                      >
                        Join Mission
                      </Button>
                    ) : (
                      <Button className="w-full bg-gray-400 hover:bg-gray-500" disabled>
                        {mission.status === "inactive" && "Inactive"}
                        {mission.maxParticipants &&
                          mission.participants >= mission.maxParticipants &&
                          "Participation Closed"}
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
                  There are currently no available missions.
                </p>
                <p className="text-sm text-gray-500">Please wait for new missions to be added.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MemberMission;
