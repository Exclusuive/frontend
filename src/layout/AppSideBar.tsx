import {
  LayoutDashboard,
  FileEdit,
  BadgeCheck,
  PackageOpen,
  HelpCircle,
  Store,
  ShoppingCart,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "../components/ui/button";
import {
  useWallets,
  useDisconnectWallet,
  useCurrentAccount,
  useConnectWallet,
} from "@mysten/dapp-kit";
import { Link, useLocation } from "react-router-dom";
import { navigateWithQuery } from "@/lib/utils";
import { useState } from "react";

// import { navigateWithQuery } from "@/lib/manageUrl";
// Menu items.
const DEAFULT_MENUS = {
  Default: [
    {
      title: "Home",
      url: "/",
      icon: LayoutDashboard,
    },
  ],
};
const ADMIN_MENUS = {
  Collection: [
    {
      title: "Overview",
      url: "/admin/collections",
      icon: LayoutDashboard,
    },
    {
      title: "Manage Collection",
      url: "/admin/collections/edit",
      icon: FileEdit,
    },
    {
      title: "Manage Store",
      url: "/admin/collections/store",
      icon: Store,
    },
    {
      title: "Mint & Transfer",
      url: "/admin/collections/mint",
      icon: PackageOpen,
    },
  ],
  MembershipPolicy: [
    {
      title: "Overview",
      url: "/admin/membershippolicy",
      icon: LayoutDashboard,
    },
    {
      title: "Manage Membership Policy",
      url: "/admin/membershippolicy/edit",
      icon: FileEdit,
    },
    {
      title: "Manage Vending Machine",
      url: "/admin/membershippolicy/vendingmachine",
      icon: Store,
    },
  ],
};

const MEMBER_MENUS = {
  MyPage: [
    {
      title: "Overview",
      url: "/member",
      icon: LayoutDashboard,
    },
    {
      title: "My Collection Objects",
      url: "/member/collection",
      icon: BadgeCheck,
    },
    {
      title: "Collection Store",
      url: "/member/collection/store",
      icon: Store,
    },
    {
      title: "My Membership Objects",
      url: "/member/membership",
      icon: BadgeCheck,
    },
    {
      title: "Member Vending Machine",
      url: "/member/membership/vendingmachine",
      icon: Store,
    },
  ],
  Explore: [
    {
      title: "Explore Collection Store",
      url: "/explore/collection/store",
      icon: ShoppingCart,
    },
    {
      title: "Explore Vending Machine",
      url: "/explore/membership/vendingmachine",
      icon: ShoppingCart,
    },
  ],
};
export default function AppSidebar() {
  const [isAdmin, setIsAdmin] = useState(false);

  const account = useCurrentAccount();
  const wallets = useWallets();
  const location = useLocation();

  const { mutate: disconnect } = useDisconnectWallet();
  const { mutate: connect } = useConnectWallet();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="text-center text-lg font-extrabold"> Exclusuive Dashboard</div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <div className="flex h-48 w-full flex-col-reverse overflow-y-hidden">
            <img className="w-full" src="/DOKPAMI.png" alt="character loading..." />
          </div>

          {account ? (
            <div className="mx-auto w-5/6">
              <p className="text-center text-lg font-bold">{account.label}</p>
              <Button
                className="w-full bg-black text-white hover:bg-white hover:text-black"
                onClick={() => disconnect()}
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <div className="mx-auto w-5/6">
              <Button
                className="w-full bg-white text-black hover:text-white"
                onClick={() => connect({ wallet: wallets[0] })}
              >
                Connect wallet
              </Button>
            </div>
          )}
        </SidebarGroup>
      </SidebarContent>

      <SidebarContent>
        <div className="scrollbar-hide overflow-y-auto whitespace-nowrap">
          {Object.entries(DEAFULT_MENUS).map(([headding, menus]) => {
            return (
              <SidebarGroup key={headding}>
                <SidebarGroupLabel>{headding}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {menus.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <Link to={navigateWithQuery(item.url, location.search)}>
                            <item.icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            );
          })}

          {isAdmin &&
            Object.entries(ADMIN_MENUS).map(([headding, menus]) => {
              return (
                <SidebarGroup key={headding}>
                  <SidebarGroupLabel>{headding}</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {menus.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild>
                            <Link to={navigateWithQuery(item.url, location.search)}>
                              <item.icon />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              );
            })}

          {!isAdmin &&
            Object.entries(MEMBER_MENUS).map(([headding, menus]) => {
              return (
                <SidebarGroup key={headding}>
                  <SidebarGroupLabel>{headding}</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {menus.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild>
                            <Link to={navigateWithQuery(item.url, location.search)}>
                              <item.icon />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              );
            })}
        </div>
      </SidebarContent>
      <SidebarFooter className="relative">
        <button
          type="button"
          onClick={() => setIsAdmin(!isAdmin)}
          className="absolute top-4 right-4 z-10 flex w-12 cursor-pointer flex-col items-center justify-center"
        >
          <SidebarGroupLabel>{isAdmin ? "admin" : "member"}</SidebarGroupLabel>
          <span
            className={`relative inline-flex cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out ${
              isAdmin ? "bg-pink-500" : "bg-gray-300"
            } h-5 w-10`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ease-in-out ${
                isAdmin ? "translate-x-0.5" : "translate-x-5.5"
              }`}
            />
          </span>
        </button>

        <div className="rounded-lg bg-white p-4">
          <div className="flex items-center">
            <HelpCircle size={24} className="text-blue-500" />
            <p className="ml-3 text-sm text-gray-700">Need Help?</p>
          </div>
          <button className="mt-1 cursor-pointer text-xs text-gray-500">
            Please check our docs
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
