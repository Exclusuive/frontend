import { useEffect, useState } from "react";
import { useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit";
import { extractSupplierIds, getDynamicObjectIds, getMultiObjectFields } from "@/lib/sui"; // 유틸 함수들 import
import { Supplier } from "@/types/types";

const PACKAGE_ID = import.meta.env.VITE_MOVE_CALL_PACKAGE_ID;
const MODULE_ID = import.meta.env.VITE_MODULE;
const COL_CAP_TYPE = `${PACKAGE_ID}::${MODULE_ID}::SupplierCreated`;

export const useGetSuppliers = (
  collectionId: string
): { data: Supplier[]; loading: boolean; error: any } => {
  const [result, setResult] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [internalError, setInternalError] = useState<Error | null>(null);
  const suiClient = useSuiClient();

  const {
    data,
    isPending,
    error: queryError,
  } = useSuiClientQuery("queryEvents", {
    query: {
      MoveEventType: COL_CAP_TYPE,
    },
  });

  useEffect(() => {
    if (!data || isPending || queryError) return;

    const objectIds = data.data.map((item: any) => item.parsedJson.id);

    const fetchSupplierInfos = async () => {
      setLoading(true);
      setInternalError(null);

      try {
        const allSupplierInfo = await Promise.all(
          objectIds.map(async (supplier_id) => {
            const dynamicIds = await getDynamicObjectIds(suiClient, supplier_id);
            const allIds = [supplier_id, ...dynamicIds];
            const suppliers = await getMultiObjectFields(suiClient, allIds);

            const parseProductValue = (productValue: any) => {
              if (!productValue?.type) return null;

              if (productValue.type.endsWith("::Item")) {
                return {
                  type: "Item",
                  item_type: productValue.fields.item_type,
                  img_url: productValue.fields.img_url,
                };
              } else if (productValue.type.endsWith("::Property")) {
                return {
                  type: "Property",
                  property_type: productValue.fields.type.fields.type,
                  value: productValue.fields.value,
                };
              } else if (productValue.type.endsWith("::Ticket")) {
                return {
                  type: "Ticket",
                  ticket_type: productValue.fields.type.fields.type,
                };
              }

              return null;
            };

            const products = suppliers.flatMap((supplier: any) => {
              const grouped = new Map<string, any>();

              supplier.value?.forEach((productValue: any) => {
                const parsed = parseProductValue(productValue);
                if (!parsed) return;

                const key = JSON.stringify(parsed);
                const existing = grouped.get(key);

                if (existing) {
                  existing.amount += 1;
                } else {
                  grouped.set(key, {
                    selectionNumber: supplier.name.fields.selection_number,
                    ...parsed,
                    amount: 1,
                  });
                }
              });

              return Array.from(grouped.values());
            });

            // Map over each supplier to return their details
            return suppliers.map((supplier: any) => {
              const customSelections = (supplier.selections || []).map((selection: any) => {
                const number = selection.fields.number;
                const relatedProducts = products.filter(
                  (product: any) => product.selectionNumber === number
                );

                return {
                  ...selection,
                  fields: {
                    ...selection.fields,
                    type: selection.fields.product.fields.name.split("::")[2],
                    products: relatedProducts,
                  },
                };
              });

              return {
                supplier_id,
                collection_id: supplier.collection_id,
                name: supplier.name || "",
                balance: supplier.balance || 0,
                selections: customSelections,
              } as Supplier;
            });
          })
        );

        setResult(allSupplierInfo.flat().filter(Boolean) as Supplier[]);
      } catch (e) {
        console.error("Unexpected error during fetch:", e);
        setInternalError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchSupplierInfos();
  }, [data, isPending, queryError]);

  return {
    data: result,
    loading,
    error: queryError || internalError,
  };
};
