import { Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import SelectCollectionCard from "./SelectCollectionCard";
import { useGetManageCollections } from "@/hooks/useGetManageCollections";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { CreateCollectionDialog } from "./CreateCollectionDialog";
import { updateCollectionIdParam } from "@/lib/utils";
import { useGetUserOwnedCollections } from "@/hooks/useGetUserOwnedCollections";

export default function CollectionsLayout({ create }: { create: boolean }) {
  const [searchParams] = useSearchParams();
  const selectedId = searchParams.get("collection_id");
  const navigate = useNavigate();
  const location = useLocation();
  const account = useCurrentAccount();
  const { data } = create
    ? useGetManageCollections(account?.address || "")
    : useGetUserOwnedCollections(account?.address || "");

  const [open, setOpen] = useState(!selectedId);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  // Add useEffect to handle location changes
  useEffect(() => {
    if (!selectedId) {
      setOpen(true);
    }
  }, [location.pathname, selectedId]);

  const handleSelect = (collection_id: string, cap_id: string) => {
    updateCollectionIdParam(collection_id, cap_id, searchParams, location, navigate);
    setOpen(false);
  };

  const handleCreateNew = () => {
    setOpen(false);
    setShowCreateDialog(true);
  };

  return (
    <div className="w-screen space-y-10 px-4 py-6">
      <SelectCollectionCard
        items={data}
        onClick={handleSelect}
        open={open}
        create={create}
        onCreate={handleCreateNew}
        onOpenChange={setOpen}
      />
      <CreateCollectionDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
      <Outlet />
    </div>
  );
}
