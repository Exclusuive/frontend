import { Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import SelectCollectionCard from "./SelectCollectionCard";
import { useGetManageCollections } from "@/hooks/useGetManageCollections";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useState } from "react";
import { CreateCollectionDialog } from "./CreateCollectionDialog";
import { useGetUserOwnedCollections } from "@/hooks/useGetUserOwnedCollections";
import { updateUrlQuery } from "@/lib/manageUrl";
export default function CollectionsLayout({ manage }: { manage: boolean }) {
  const [searchParams] = useSearchParams();
  const selectedId = searchParams.get("collection_id");
  const [open, setOpen] = useState(!selectedId);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const account = useCurrentAccount();
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = manage
    ? useGetManageCollections(account?.address || "")
    : useGetUserOwnedCollections(account?.address || "");

  const handleSelect = (collection_id: string, cap_id?: string) => {
    let paths = [];
    if (collection_id) {
      paths.push({ name: "collection_id", value: collection_id });
    }
    // Only add cap_id if it is provided
    if (cap_id) {
      paths.push({ name: "cap_id", value: cap_id });
    }

    updateUrlQuery(paths, searchParams, location, navigate);
    setOpen(false);
    setShowCreateDialog(false);
  };

  const handleCreateNew = () => {
    setOpen(false);
    setShowCreateDialog(true);
  };

  return (
    <div className="space-y-10 px-4 py-6">
      <SelectCollectionCard
        items={data}
        onClick={handleSelect}
        open={open}
        create={manage}
        onCreate={handleCreateNew}
        onOpenChange={setOpen}
      />
      <CreateCollectionDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={handleSelect}
      />
      <Outlet />
    </div>
  );
}
