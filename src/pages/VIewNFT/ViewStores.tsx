import { useState, useEffect } from "react";

import { Store } from "@/types/types";
import { useSearchParams } from "react-router-dom";

import SelectStoreContractModal from "@/components/SelectStoreCard";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useGetStores } from "@/hooks/useGetStores";
import SlotCard from "@/components/SlotCard";
import { useGetTickets } from "@/hooks/useGetTickets";

export default function ViewStores() {
  const account = useCurrentAccount();
  const [searchParams, setSearchParams] = useSearchParams();
  const collectionId = searchParams.get("collection_id");
  const storeId = searchParams.get("store_id");

  const { data: stores, loading, error } = useGetStores();

  const { tickets } = useGetTickets(account?.address || "");

  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const [showStoreContractDialog, setShowStoreContractDialog] = useState(false);

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

  const handleStoreSelect = (store: Store) => {
    setSelectedStore(store);
    setShowStoreContractDialog(false);

    // Update URL with supplier ID and cap ID
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("store_id", store.store_id);
    newSearchParams.set("store_cap_id", store.store_cap_id);
    setSearchParams(newSearchParams);
  };

  if (loading) {
    return <div>Loading stores...</div>;
  }

  if (error) {
    return <div>Error loading stores: {error.message}</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-3xl font-bold">Manage Store Contracts</h1>

      {/* Store Selection Dialog */}
      <SelectStoreContractModal
        open={showStoreContractDialog}
        items={stores}
        onClick={handleStoreSelect}
        create={true}
        onCreate={() => {}}
        onOpenChange={setShowStoreContractDialog}
      />

      {selectedStore && (
        <SlotCard
          manage={false}
          selectedStore={selectedStore}
          setShowStoreContractDialog={setShowStoreContractDialog}
          tickets={tickets}
        />
      )}
    </div>
  );
}
