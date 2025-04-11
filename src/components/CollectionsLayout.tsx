import { Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import SelectCollectionCard from "./SelectCollectionCard";
import { useGetManageCollections } from "@/hooks/useGetManageCollections";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";

export default function CollectionsLayout({ create }: { create: boolean }) {
  const [searchParams] = useSearchParams();
  const selectedId = searchParams.get("collection_id");
  const navigate = useNavigate();
  const location = useLocation();
  const account = useCurrentAccount();
  const { data } = useGetManageCollections(account?.address || "");
  const [open, setOpen] = useState(false);

  const handleSelect = (collection_id: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("collection_id", collection_id);

    navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });
  };

  useEffect(() => {
    setOpen(!selectedId); // selectedId 없으면 true, 있으면 false
  }, [selectedId]);

  return (
    <div className="w-screen space-y-10 px-4 py-6">
      {!selectedId && (
        <SelectCollectionCard
          items={data}
          onClick={handleSelect}
          open={open}
          create={create}
          onOpenChange={() => setOpen(false)}
        />
      )}
      <Outlet />
    </div>
  );
}
