import {
  LayoutDashboard,
  FileEdit,
  BadgeCheck,
  PackageOpen,
  HelpCircle,
  Store,
  Image,
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

import { Link, useLocation } from "react-router-dom";
import { navigateWithQuery } from "@/lib/utils";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Button } from "@/components/ui/button";
import { useDisconnectWallet, useCurrentAccount } from "@mysten/dapp-kit";
const ADMIN_MENUS = {
  Collection: [
    {
      title: "Overview",
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Edit Collection",
      url: "/admin/edit",
      icon: FileEdit,
    },
    {
      title: "Manage Store",
      url: "/admin/store",
      icon: Store,
    },
    {
      title: "Mint & Transfer",
      url: "/admin/mint",
      icon: PackageOpen,
    },
  ],
  // MembershipPolicy: [
  //   {
  //     title: "Overview",
  //     url: "/admin/membershippolicy",
  //     icon: LayoutDashboard,
  //   },
  //   {
  //     title: "Manage Membership Policy",
  //     url: "/admin/membershippolicy/edit",
  //     icon: FileEdit,
  //   },
  //   {
  //     title: "Manage Vending Machine",
  //     url: "/admin/membershippolicy/vendingmachine",
  //     icon: Store,
  //   },
  // ],
};

const MEMBER_MENUS = {
  MyPage: [
    {
      title: "My NFTs",
      url: "/member/mynfts",
      icon: BadgeCheck,
    },

    // {
    //   title: "My Collection Objects",
    //   url: "/member/collection",
    //   icon: BadgeCheck,
    // },
    // {
    //   title: "Collection Store",
    //   url: "/member/collection/store",
    //   icon: Store,
    // },
    // // {
    // //   title: "My Membership Objects",
    // //   url: "/member/membership",
    // //   icon: BadgeCheck,
    // // },
    // // {
    // //   title: "Member Vending Machine",
    // //   url: "/member/membership/vendingmachine",
    // //   icon: Store,
    // // },
  ],
  Explore: [
    {
      title: "Explore Collections",
      url: "/explore/collections",
      icon: LayoutDashboard,
    },
    {
      title: "Get Shocase NFTs",
      url: "https://dokpami.onrender.com/",
      icon: Image,
    },
  ],
};
export default function AppSidebar() {
  const [isAdmin, setIsAdmin] = useState(true);
  const account = useCurrentAccount();
  const { mutate: disconnect } = useDisconnectWallet();

  console.log(account);

  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link to={navigateWithQuery("/", location.search)}>
          <div className="text-center text-lg font-extrabold"> Exclusuive Dashboard</div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <Tabs
            defaultValue="admin"
            className="w-full"
            onValueChange={(value) => setIsAdmin(value === "admin")}
          >
            <TabsList className="grid w-full grid-cols-2 rounded-md bg-gray-200 p-1 text-gray-700">
              <TabsTrigger
                value="admin"
                className="rounded-md px-4 py-2 text-gray-600 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                Admin
              </TabsTrigger>
              <TabsTrigger
                value="member"
                className="rounded-md px-4 py-2 text-gray-600 data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >
                Member
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {account && (
            <div className="mx-auto my-4 w-full">
              <p className="text-md py-2 text-center font-bold">
                {account.address.slice(0, 8)}...{account.address.slice(-8)}
              </p>
              <Button
                className="w-full bg-gray-400 text-white hover:bg-white hover:text-black"
                onClick={() => disconnect()}
              >
                Disconnect
              </Button>
            </div>
          )}
        </SidebarGroup>

        <div className="scrollbar-hide overflow-y-auto whitespace-nowrap">
          {/* {Object.entries(DEAFULT_MENUS).map(([headding, menus]) => {
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
          })} */}

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
        <div className="rounded-lg bg-white p-4">
          <div className="flex items-center pb-3">
            <HelpCircle size={24} className="text-blue-500" />
            <p className="ml-3 text-sm text-gray-700">Need Help?</p>
          </div>
          <Link to="/docs">
            <Button
              variant="link"
              className="h-auto w-full bg-blue-500 px-4 py-2 text-xs text-white hover:bg-blue-600"
            >
              Please check our docs
            </Button>
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
