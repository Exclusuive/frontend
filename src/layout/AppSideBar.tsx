import {
  LayoutDashboard,
  FileEdit,
  Image,
  BadgeCheck,
  PackageOpen,
  HelpCircle,
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
      title: "Home",
      url: "/admin/collections",
      icon: LayoutDashboard,
    },
    {
      title: "Edit Collection",
      url: "/admin/collections/edit",
      icon: FileEdit,
    },
    {
      title: "Manage Collection Store",
      url: "/admin/collections/store",
      icon: Image,
    },
    {
      title: "Mint Items",
      url: "/admin/collections/mint",
      icon: PackageOpen,
    },
  ],
  MembershipPolicy: [
    {
      title: "Home",
      url: "/admin/membershippolicy",
      icon: LayoutDashboard,
    },
    {
      title: "Mange MembershipPolicy",
      url: "/admin/membershippolicy/...",
      icon: FileEdit,
    },
    {
      title: "Manage MembershipPolicy VendingMachine",
      url: "/admin/membershippolicy/...",
      icon: Image,
    },
    {
      title: "Mint Items",
      url: "/admin/membershippolicy/...",
      icon: PackageOpen,
    },
  ],
};

const MEMBER_MENUS = {
  MyNFT: [
    {
      title: "Home",
      url: "/member",
      icon: LayoutDashboard,
    },

    {
      title: "My Membership",
      url: "/member/mymembership",
      icon: BadgeCheck,
    },

    {
      title: "Explore Membership Store",
      url: "/member/membershipstore",
      icon: PackageOpen,
    },
  ],
};
export default function AppSidebar() {
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
        <div className="">
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
        </div>

        <div className="overflow-y-auto whitespace-nowrap">
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

          {Object.entries(ADMIN_MENUS).map(([headding, menus]) => {
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

          {Object.entries(MEMBER_MENUS).map(([headding, menus]) => {
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
      <SidebarFooter>
        <div className="rounded-lg bg-white p-4">
          <div className="flex items-center">
            <HelpCircle size={24} className="text-blue-500" />
            <p className="ml-3 text-sm text-gray-700">Need Help?</p>
          </div>
          <p className="mt-1 text-xs text-gray-500">Please check our docs</p>
          <Button className="mt-3 w-full text-white">DOCUMENTATION</Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
