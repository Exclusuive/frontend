import { Badge } from "@/components/ui/badge";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCollectionStore } from "@/stores/useCollectionStore";
import { Button } from "./ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { useState } from "react";
import { paths } from "@/config/paths";
import { cn } from "@/lib/utils";
import { Collection, Membership } from "@/types/collection";
import { User } from "@/types/user";
import CharacterImage from "./CharacterImage";

interface MenuItem {
  label: string;
  subMenu?: { label: string; path: string }[];
}

const AdminMenuItems = [
  {
    label: "Collection",
    subMenu: [
      { label: "Dashboard", path: paths.adminDashboard.path },
      { label: "Collection", path: paths.adminCollection.path },
      { label: "Items", path: paths.adminItems.path },
      { label: "Market", path: paths.adminMarket.path },
      { label: "Mission", path: paths.adminMission.path },
      { label: "Explore Other Collections", path: paths.adminExplore.path },
    ],
  },
  {
    label: "My Page",
    subMenu: [
      { label: "Profile", path: paths.adminProfile.path },
      { label: "Billing", path: paths.adminBilling.path },
    ],
  },
];

const UserMenuItems = [
  {
    label: "Membership",
    subMenu: [
      { label: "My Character", path: paths.memberMyCharacter.path },
      { label: "Market", path: paths.memberMarket.path },
      { label: "Mission", path: paths.memberMission.path },
      { label: "Explore Other Collections", path: paths.memberExplore.path },
    ],
  },
  {
    label: "My Page",
    subMenu: [{ label: "Profile", path: paths.memberProfile.path }],
  },
];

function ProfileSection({ user }: { user: any }) {
  if (!user) return null;
  return (
    <div className="flex items-center gap-2">
      <img src={user.profile?.imgUrl} alt="profile" className="h-10 w-10 rounded-full" />
      <div>
        <div className="flex items-center gap-2 text-sm font-bold text-[#474747]">
          {user.profile?.name}
          <Badge className="rounded-full bg-[#4DA2FF] px-2 text-xs text-white">{user.role}</Badge>
        </div>
        <div className="text-sm text-[#636363]">
          <span className="font-medium">Address:</span> {user.address?.slice(0, 6)}...
          {user.address?.slice(-4)}
        </div>
      </div>
    </div>
  );
}

function CollectionSection({
  collection,
  user,
}: {
  collection: Collection | null;
  user: User | null;
}) {
  if (user?.role !== "admin") return null;
  return (
    <div className="my-8">
      <p className="text-md font-bold text-[#474747]">Selected Collection</p>
      <div className="my-4 flex items-center gap-2">
        <img src={collection?.img_url} alt="collection" className="h-10 w-10 rounded-full" />
        <div>
          <div className="text-sm font-bold text-[#474747]">{collection?.name}</div>
          <a
            href={`https://suiscan.xyz/address/${collection?.collection_id}`}
            target="_blank"
            className="text-sm text-blue-500 underline"
          >
            view on Explorer
          </a>
        </div>
      </div>
      <Link to="/setCollection" className="w-full">
        <Button variant="secondary" className="w-full">
          Change Collection/Role
        </Button>
      </Link>
    </div>
  );
}

function MembershipSection({
  membership,
  user,
}: {
  membership: Membership | null;
  user: User | null;
}) {
  if (user?.role !== "member") return null;
  if (!membership) return null;
  return (
    <div className="my-8">
      <p className="text-md font-bold text-[#474747]">Selected Membership</p>
      <div className="my-4 flex items-center gap-2">
        <div className="relative h-10 w-10 rounded-full border">
          <CharacterImage membership={membership} />
        </div>
        <div>
          <div className="text-sm font-bold text-[#474747]">
            {membership?.address.slice(0, 10)}...
            {membership?.address.slice(-10)}
          </div>
        </div>
      </div>
      <Link to="/setCollection" className="w-full">
        <Button variant="secondary" className="w-full">
          Change Membership/Role
        </Button>
      </Link>
    </div>
  );
}
function MenuSection({ menuItems }: { menuItems: MenuItem[] }) {
  const location = useLocation();

  const isActivePath = (path: string) => {
    // Handle root admin path
    if (path === "" && (location.pathname === "/admin" || location.pathname === "/member")) {
      return true;
    }
    // Handle other paths
    return location.pathname === `/admin/${path}` || location.pathname === `/member/${path}`;
  };

  return (
    <Accordion
      type="multiple"
      className="flex w-full flex-col gap-2"
      defaultValue={menuItems.map((item: MenuItem) => item.label)}
    >
      {menuItems.map((item: MenuItem) => (
        <AccordionItem key={item.label} value={item.label}>
          <AccordionTrigger className="text-md text-left font-semibold text-[#474747]">
            {item.label}
          </AccordionTrigger>
          {item.subMenu && (
            <AccordionContent>
              <div className="flex flex-col gap-y-2 pl-4">
                {item.subMenu.map((sub: { label: string; path: string }, subIdx: number) => {
                  const isActive = isActivePath(sub.path);
                  return (
                    <div
                      key={subIdx}
                      className="cursor-pointer text-sm transition-transform duration-150 ease-in-out hover:scale-105 focus:scale-105 active:scale-100"
                      tabIndex={0}
                      role="button"
                    >
                      <Link
                        to={sub.path}
                        className={cn(
                          "block w-full",
                          isActive ? "font-medium text-[#4DA2FF]" : "text-[#636363]",
                        )}
                      >
                        {sub.label}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          )}
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const { user } = useAuthStore();
  const { collection } = useCollectionStore();
  const membership = collection?.selected_membership || null;

  // 모바일 오버레이 메뉴
  const MobileSidebar = () => (
    <div
      className={`fixed top-0 right-0 z-30 h-screen w-2/3 bg-white p-4 shadow-lg transition-transform duration-300 ease-in-out sm:hidden ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
      aria-label="Sidebar menu"
    >
      <X
        onClick={() => setOpen(false)}
        size={24}
        className="absolute top-4 right-4 cursor-pointer"
      />
      <div className="mt-8 flex flex-col">
        <ProfileSection user={user} />
        <CollectionSection collection={collection} user={user} />
        <MembershipSection membership={membership} user={user} />
        <MenuSection menuItems={user?.role === "admin" ? AdminMenuItems : UserMenuItems} />
      </div>
    </div>
  );

  // 데스크탑 고정 사이드바
  const DesktopSidebar = () => (
    <div className="hidden h-full min-h-screen w-64 flex-col border-r bg-white p-4 shadow-sm sm:flex">
      <Link to="/" className="font-Exclusuive text-center text-[28px] font-bold tracking-wider">
        Exclu
        <span className="inline-block -translate-y-2 font-extrabold text-[#4DA2FF]">Sui</span>
        ve
      </Link>
      <div className="mt-8" />
      <ProfileSection user={user} />
      <CollectionSection collection={collection} user={user} />
      <MembershipSection membership={membership} user={user} />
      <MenuSection menuItems={user?.role === "admin" ? AdminMenuItems : UserMenuItems} />
    </div>
  );

  return (
    <div>
      {/* 모바일 헤더 */}
      <div className="flex items-center justify-between border-b bg-white p-4 shadow-sm sm:hidden">
        <div className="font-Exclusuive flex-1 text-center text-[24px] font-bold tracking-wider">
          <Link to="/" className="transition-opacity hover:opacity-80">
            Exclu
            <span className="inline-block -translate-y-1 font-extrabold text-[#4DA2FF]">Sui</span>
            ve
          </Link>
        </div>
        <button
          className="flex items-center justify-center p-2 text-[#474747] transition-colors hover:text-[#4DA2FF]"
          onClick={() => setOpen((v) => !v)}
          aria-label="Open sidebar"
        >
          <Menu size={24} />
        </button>
      </div>
      <MobileSidebar />
      {/* 데스크탑 사이드바 */}
      <DesktopSidebar />
    </div>
  );
}
