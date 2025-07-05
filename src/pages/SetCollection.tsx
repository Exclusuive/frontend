import SetRolePopup from "@/components/SetRolePopup";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useAuthStore } from "@/stores/useAuthStore";
import { useState } from "react";
import { Membership, Role } from "@/types/user";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { CirclePlusIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCollectionStore } from "@/stores/useCollectionStore";
import { Collection } from "@/types/collection";
import { collections } from "@/data/collections";
import CreateCollection from "@/components/CreateCollection";
import { sampleMemberships } from "@/data/membership";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MembershipByCollection, organizeMembershipsByCollection } from "@/lib/membership";
import { useMembershipStore } from "@/stores/useMembershipStore";

const SetCollectionPage = () => {
  const { user, setRole } = useAuthStore();
  const { setCollection } = useCollectionStore();
  const { setMembership } = useMembershipStore();
  const [changeRoleOpen, setChangeRoleOpen] = useState(false);
  const [createCollectionOpen, setCreateCollectionOpen] = useState(false);
  const navigate = useNavigate();
  const handleChangeRole = (selectedRole: Role) => {
    if (!selectedRole) return;
    setRole(selectedRole);
    setChangeRoleOpen(false);
  };

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
        <SetRolePopup onOpenChange={setChangeRoleOpen} onConfirm={handleChangeRole} />
      </Dialog>
    );
  }

  const handleSelectMembership = (membership: Membership) => {
    setMembership(membership);
    navigate(`/${user.role}`);
  };

  const handleSelectCollection = (collection: Collection) => {
    setCollection(collection);
    navigate(`/${user.role}`);
  };

  return (
    <div className="mx-auto mt-16 w-full max-w-2xl rounded-lg bg-white p-6 px-10 sm:w-1/2 sm:shadow-md">
      <h1 className="mb-6 text-center text-2xl font-bold text-[#474747]">컬렉션 선택</h1>

      <div className="mt-8 rounded-lg border bg-gray-50 p-4 text-gray-800">
        <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 font-semibold text-[#474747]">내 프로필</div>
            <div className="flex items-center gap-2">
              <img src={user.profile.imgUrl} alt="profile" className="h-10 w-10 rounded-full" />
              <div>
                <div className="text-sm font-bold text-[#474747]">{user.profile.name}</div>
                <div className="text-sm text-[#636363]">
                  <span className="font-medium">지갑 주소:</span> {user.address.slice(0, 6)}...
                  {user.address.slice(-4)}
                </div>
                <div className="text-sm text-[#636363]">
                  <span className="font-medium">역할:</span> {user.role}
                </div>
              </div>
            </div>
          </div>
          <Dialog open={changeRoleOpen} onOpenChange={setChangeRoleOpen}>
            <DialogTrigger>
              <Button className="mt-8 w-full bg-[#4CA3FF] text-white hover:bg-[#4CA3FF]/90">
                역할 변경하기
              </Button>
            </DialogTrigger>
            <SetRolePopup onOpenChange={setChangeRoleOpen} onConfirm={handleChangeRole} />
          </Dialog>
        </div>
      </div>

      <ul className="mt-8 space-y-3">
        {user.role === "admin"
          ? collections.map((col: Collection) => {
              return (
                <li key={col.address}>
                  <button
                    type="button"
                    className={`w-full cursor-pointer rounded-lg border px-4 py-3 text-left transition-colors focus:ring-2 focus:ring-blue-500 focus:outline-none`}
                    onClick={() => handleSelectCollection(col)}
                  >
                    <div className="flex items-center gap-2">
                      <img src={col.imgUrl} alt="collection" className="h-10 w-10 rounded-full" />
                      <div>
                        <div className="text-sm font-bold text-[#474747]">{col.name}</div>
                        <div className="text-sm text-[#636363]">{col.description}</div>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })
          : organizeMembershipsByCollection(sampleMemberships).map(
              (membership: MembershipByCollection) => {
                console.log(membership);
                return (
                  <Accordion
                    key={membership.collectionName}
                    type="single"
                    collapsible
                    className="w-full rounded-lg border border-gray-200 px-2"
                  >
                    <AccordionItem value={membership.collectionName}>
                      <AccordionTrigger>
                        <div className="flex items-center gap-2 rounded-lg">
                          <img
                            src={membership.collectionImgUrl}
                            alt="collection"
                            className="h-10 w-10 rounded-full"
                          />
                          <div>{membership.collectionName}</div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-col gap-2 bg-gray-100 py-4 pl-10">
                          {membership.memberships.map((membership: Membership) => {
                            return (
                              <div
                                className="flex w-full cursor-pointer items-center gap-2"
                                key={membership.id}
                                onClick={() => handleSelectMembership(membership)}
                              >
                                <img
                                  src={membership.imgUrl}
                                  alt="collection"
                                  className="h-10 w-10 rounded-full"
                                />
                                <div>{membership.id}</div>
                              </div>
                            );
                          })}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                );
              },
            )}
      </ul>
      {user.role === "admin" && (
        <Dialog open={createCollectionOpen} onOpenChange={setCreateCollectionOpen}>
          <DialogTrigger asChild>
            <button
              type="button"
              className="my-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-[#4CA3FF] py-3 transition-colors hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:outline-none active:bg-blue-100"
              aria-label="컬렉션 추가"
            >
              <CirclePlusIcon className="h-8 w-8 text-[#4CA3FF]" aria-hidden="true" />
              <span className="text-md font-bold text-[#474747]">Add Collection</span>
            </button>
          </DialogTrigger>
          <CreateCollection onOpenChange={setCreateCollectionOpen} />
        </Dialog>
      )}
    </div>
  );
};

export default SetCollectionPage;
