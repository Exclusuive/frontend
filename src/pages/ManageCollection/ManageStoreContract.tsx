import { useState, useEffect } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useGetManageStores } from "@/hooks/useGetManageStores";
import { Store } from "@/types/types";
import { useSendTransactions } from "@/hooks/useSendTransactions";
import { useSearchParams } from "react-router-dom";

import SelectStoreContractModal from "@/components/SelectStoreCard";
import SlotCard from "@/components/SlotCard";
export default function ManageStoreContract() {
  const account = useCurrentAccount();
  const [searchParams, setSearchParams] = useSearchParams();
  const collectionId = searchParams.get("collection_id");
  const capId = searchParams.get("cap_id");
  const storeId = searchParams.get("store_id");
  const { data: stores, loading, error } = useGetManageStores(account?.address || "");

  const [newStoreName, setNewStoreName] = useState("");
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const [showStoreContractDialog, setShowStoreContractDialog] = useState(false);
  const [showCreateStoreContractDialog, setShowCreateStoreContractDialog] = useState(false);

  const { newStoreContract } = useSendTransactions();

  const handleCreateStoreContract = async () => {
    if (!newStoreName.trim()) {
      return;
    }

    await newStoreContract({
      id: collectionId || "",
      capId: capId || "",
      storeName: newStoreName,
    });

    // Here you would call the actual API to create a supplier
    setNewStoreName("");
    setShowCreateStoreContractDialog(false);
  };

  const handleStoreSelect = (store: Store) => {
    setSelectedStore(store);
    setShowStoreContractDialog(false);

    // Update URL with supplier ID and cap ID
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("store_id", store.store_id);
    newSearchParams.set("store_cap_id", store.store_cap_id);
    setSearchParams(newSearchParams);
  };

  const handleCreateNewStoreContract = () => {
    setShowStoreContractDialog(false);
    setShowCreateStoreContractDialog(true);
  };

  useEffect(() => {
    if (storeId) {
      setSelectedStore(stores?.find((store) => store.store_id === storeId) || null);
    } else {
      if (collectionId) {
        setShowStoreContractDialog(true);
        setSelectedStore(null);
      }
    }
  }, [storeId, stores, collectionId]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">Error loading collection</div>
    );
  }

  return (
    <div className="container mx-auto w-full py-6">
      <h1 className="mb-6 text-3xl font-bold">Manage Stores</h1>

      {/* Supplier Selection Dialog */}
      <SelectStoreContractModal
        open={showStoreContractDialog}
        items={stores}
        onClick={handleStoreSelect}
        create={true}
        onCreate={handleCreateNewStoreContract}
        onOpenChange={setShowStoreContractDialog}
      />

      {/* Create Supplier Dialog */}
      <Dialog open={showCreateStoreContractDialog} onOpenChange={setShowCreateStoreContractDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Store Contract</DialogTitle>
            <DialogDescription>Enter the details for the new store contract.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newStoreName}
                onChange={(e) => setNewStoreName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCreateStoreContract}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {selectedStore && (
        <SlotCard
          manage={true}
          selectedStore={selectedStore}
          setShowStoreContractDialog={setShowStoreContractDialog}
        />
      )}
    </div>
  );
}
