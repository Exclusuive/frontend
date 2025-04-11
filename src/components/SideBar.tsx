import {
  LayoutDashboard,
  FileEdit,
  Image,
  Boxes,
  Handshake,
  BadgeCheck,
  Wrench,
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
import { Button } from "./ui/button";
import {
  useWallets,
  useDisconnectWallet,
  useCurrentAccount,
  useConnectWallet,
} from "@mysten/dapp-kit";
import { Link } from "react-router-dom";

// Menu items.
const manage_collection_menus = [
  {
    title: "Home",
    url: "/collections",
    icon: LayoutDashboard,
  },
  {
    title: "Edit collection info",
    url: "/collections/editinfo",
    icon: FileEdit,
  },
  {
    title: "Manage base NFT",
    url: "collections/bases",
    icon: Image,
  },
  {
    title: "Manage item NFT",
    url: "collections/items",
    icon: Boxes,
  },
  {
    title: "Manage supplier contract",
    url: "collections/suppliers",
    icon: Handshake,
  },
];

const manage_nft_menus = [
  {
    title: "View My NFT",
    url: "#",
    icon: BadgeCheck,
  },
  {
    title: "Equip Item to my NFT",
    url: "#",
    icon: Wrench,
  },
  {
    title: "Get Item through supplier",
    url: "#",
    icon: PackageOpen,
  },
];

export default function AppSidebar() {
  const account = useCurrentAccount();
  const wallets = useWallets();

  const { mutate: disconnect } = useDisconnectWallet();
  const { mutate: connect } = useConnectWallet();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="text-center text-lg font-extrabold"> Exclusuive Dashboard</div>
      </SidebarHeader>
      <SidebarContent>
        <img className="-my-10" src="/DOKPAMI.png" alt="character loading..." />

        <div>
          {account ? (
            <div className="mx-auto w-5/6">
              <p className="my-5 text-center text-lg font-bold">{account.label}</p>
              <Button
                className="w-full bg-black text-white hover:bg-white hover:text-black"
                onClick={() => disconnect()}
              >
                Disconnect
              </Button>
            </div>
          ) : (
            <div className="mx-auto my-10 w-5/6">
              <Button
                className="w-full bg-white text-black hover:text-white"
                onClick={() => connect({ wallet: wallets[0] })}
              >
                Connect wallet
              </Button>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Manage NFT Collections</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {manage_collection_menus.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Manage My NFTs</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {manage_nft_menus.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
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
