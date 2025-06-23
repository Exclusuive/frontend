import SetRolePopup from "@/components/SetRolePopup";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useAuthStore } from "@/stores/useAuthStore";
import { useState } from "react";
import { Role } from "@/types/User";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { onLogin } from "./LandingPage";

const collections = [
  { id: "1", name: "Art Collection" },
  { id: "2", name: "Music Collection" },
  { id: "3", name: "Sports Collection" },
];

const SetCollectionPage = () => {
  const { user } = useAuthStore();
  const [changeRoleOpen, setChangeRoleOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<string | undefined>(undefined);

  if (!user) {
    return (
      <Dialog open={changeRoleOpen} onOpenChange={setChangeRoleOpen}>
        <DialogTrigger asChild>
          <div className="flex h-screen flex-col items-center justify-center">
            <Button className="h-fit w-fit bg-gradient-to-r from-[#5656F2] to-[#4CA3FF] leading-[normal] font-bold transition-transform duration-200 ease-in-out hover:scale-105 focus:scale-105 active:scale-100">
              <div className="flex items-center px-10 py-2 text-xl">
                <span className="pr-2">Try it out</span>
                <ArrowRightIcon className="h-4 w-4 font-bold" />
              </div>
            </Button>
          </div>
        </DialogTrigger>
        <SetRolePopup
          onOpenChange={setChangeRoleOpen}
          onConfirm={(role) => onLogin(role, setChangeRoleOpen)}
        />
      </Dialog>
    );
  }

  const handleAddCollection = () => {
    alert("추후 구현 예정입니다.");
  };

  const onRoleConfirm = (selectedRole: Role) => {
    if (!selectedRole) return;
    setChangeRoleOpen(false);
  };

  return (
    <div className="mx-auto mt-16 w-1/2 max-w-2xl rounded-lg bg-white p-6 shadow-md">
      <h1 className="mb-6 text-center text-2xl font-bold">컬렉션 선택</h1>

      <div className="mt-8 rounded-lg border bg-gray-50 p-4 text-gray-800">
        <div className="mb-2 font-semibold">내 프로필</div>
        <div className="flex items-center gap-2">
          <img src={user.profile.avatar} alt="profile" className="h-10 w-10 rounded-full" />
          <div>
            <div className="text-sm font-bold">{user.profile.name}</div>
            <div className="text-sm">
              <span className="font-medium">지갑 주소:</span> {user.address.slice(0, 6)}...
              {user.address.slice(-4)}
            </div>
            <div className="text-sm">
              <span className="font-medium">역할:</span> {user.role}
            </div>
          </div>
        </div>

        <Dialog open={changeRoleOpen} onOpenChange={setChangeRoleOpen}>
          <DialogTrigger>
            <Button className="mt-8 w-full">역할 변경하기</Button>
          </DialogTrigger>
          <SetRolePopup onOpenChange={setChangeRoleOpen} onConfirm={onRoleConfirm} />
        </Dialog>
      </div>

      <ul className="mt-8 space-y-3">
        {collections.map((col) => {
          const isSelected = selectedCollection === col.id;
          return (
            <li key={col.id}>
              <button
                type="button"
                className={`w-full rounded-lg border px-4 py-3 text-left transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  isSelected
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-300 bg-gray-50 hover:bg-blue-50"
                }`}
                aria-pressed={isSelected}
                tabIndex={0}
                onClick={() => setSelectedCollection(col.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setSelectedCollection(col.id);
                  }
                }}
              >
                {col.name}
              </button>
            </li>
          );
        })}
      </ul>
      {selectedCollection && (
        <div className="mt-6 text-center text-lg text-green-600">
          선택된 컬렉션: {collections.find((c) => c.id === selectedCollection)?.name}
          <p>삭제예정입니닷!</p>
        </div>
      )}

      <Button onClick={handleAddCollection} className="mt-8 w-full">
        컬렉션 추가하기!
      </Button>
    </div>
  );
};

export default SetCollectionPage;
