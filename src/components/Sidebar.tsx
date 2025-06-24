import { Badge } from "@/components/ui/badge";

import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCollectionStore } from "@/stores/useCollectionStore";
import { Button } from "./ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

const menuItems = [
  {
    label: "My Collection",
    subMenu: ["Overview", "Collection", "Membership & Items", "Market", "Mission"],
  },
  { label: "My Page", subMenu: ["Profile", "Billing"] },
];

export default function Sidebar() {
  const { user } = useAuthStore();
  const { collection } = useCollectionStore();

  return (
    <div>
      <div className="flex border-b bg-gray-100 p-4 sm:hidden">
        <Link
          to="/"
          className="font-Exclusuive flex-1 text-center text-[24px] font-bold tracking-wider"
        >
          Exclu
          <span className="inline-block -translate-y-1 font-extrabold text-[#4DA2FF]">Sui</span>
          ve
        </Link>
        <Menu size={24} className="my-auto ml-auto" />
      </div>

      <div className="hidden h-screen w-64 flex-col border-r bg-white p-4 shadow-sm sm:flex">
        <Link to="/" className="font-Exclusuive text-center text-[32px] font-bold tracking-wider">
          Exclu
          <span className="inline-block -translate-y-2 font-extrabold text-[#4DA2FF]">Sui</span>
          ve
        </Link>
        <div className="mt-8 flex items-center gap-2">
          <img src={user?.profile.avatar} alt="profile" className="h-10 w-10 rounded-full" />
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-[#474747]">
              {user?.profile.name}{" "}
              <Badge className="rounded-full bg-[#4DA2FF] px-2 text-xs text-white">
                {user?.role}
              </Badge>
            </div>
            <div className="text-sm text-[#636363]">
              <span className="font-medium">Address:</span> {user?.address.slice(0, 6)}...
              {user?.address.slice(-4)}
            </div>
          </div>
        </div>

        <div className="my-8">
          <p className="text-md font-bold text-[#474747]">Selected Collection</p>
          <div className="my-4 flex items-center gap-2">
            <img src={collection?.imgUrl} alt="collection" className="h-10 w-10 rounded-full" />
            <div>
              <div className="text-sm font-bold text-[#474747]">{collection?.name}</div>
              <div className="text-sm text-[#636363]">{collection?.description}</div>
            </div>
          </div>
          <Link to="/setCollection" className="w-full">
            <Button variant="secondary" className="w-full">
              Change Collection
            </Button>
          </Link>
        </div>

        <Accordion
          type="multiple"
          className="flex w-full flex-col gap-2"
          defaultValue={menuItems.map((item) => item.label)}
        >
          {menuItems.map((item) => (
            <AccordionItem key={item.label} value={item.label}>
              <AccordionTrigger className="text-md text-left font-semibold text-[#474747]">
                {item.label}
              </AccordionTrigger>
              {item.subMenu && (
                <AccordionContent>
                  <div className="flex flex-col gap-y-2 pl-4">
                    {item.subMenu.map((sub, subIdx) => (
                      <div
                        key={subIdx}
                        className="cursor-pointer text-sm text-[#636363] transition-transform duration-150 ease-in-out hover:scale-105 focus:scale-105 active:scale-100"
                        tabIndex={0}
                        role="button"
                        aria-label={typeof sub === "string" ? sub : undefined}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            (e.target as HTMLElement).click();
                          }
                        }}
                      >
                        {sub}
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              )}
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
