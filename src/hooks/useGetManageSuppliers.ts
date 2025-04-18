import { useEffect, useState } from "react";
import { useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit";
import { extractSupplierIds, getDynamicObjectIds, getMultiObjectFields } from "@/lib/sui"; // 유틸 함수들 import
import { Supplier } from "@/types/types";

const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID;
const MODULE_ID = import.meta.env.VITE_MODULE;
const COL_CAP_TYPE = `${PACKAGE_ID}::${MODULE_ID}::SupplierCap`;

export const useGetManageSuppliers = (
  address: string,
  collectionId: string
): { data: Supplier[]; loading: boolean; error: any } => {
  const [result, setResult] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(false);
  const [internalError, setInternalError] = useState<Error | null>(null);
  const suiClient = useSuiClient();

  const disabled = !address;
  const { data, isPending, error } = useSuiClientQuery("getOwnedObjects", {
    owner: address,
    filter: { StructType: COL_CAP_TYPE },
    options: {
      showType: true,
      showContent: true,
    },
  });

  useEffect(() => {
    if (disabled || !data || isPending || error) return;

    const fetchSupplierInfos = async () => {
      setLoading(true);
      setInternalError(null);

      try {
        const caps = data.data;
        const supplierIdPairs = extractSupplierIds(caps); // ✅ 유틸 적용
        const allSupplierInfo = await Promise.all(
          supplierIdPairs.map(async ({ supplier_id, cap_id }) => {
            const dynamicIds = await getDynamicObjectIds(suiClient, supplier_id);
            const allIds = [supplier_id, ...dynamicIds];
            const allFieldsResponse = await getMultiObjectFields(suiClient, allIds);

            const supplier = allFieldsResponse[0];

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

            const products = allFieldsResponse.slice(1).flatMap((product: any) => {
              const grouped = new Map<string, any>();

              product.value.forEach((productValue: any) => {
                const parsed = parseProductValue(productValue);
                if (!parsed) return;

                const key = JSON.stringify(parsed);
                const existing = grouped.get(key);

                if (existing) {
                  existing.amount += 1;
                } else {
                  grouped.set(key, {
                    selectionNumber: product.name.fields.selection_number,
                    ...parsed,
                    amount: 1,
                  });
                }
              });

              return Array.from(grouped.values());
            });

            const customSelections = (supplier.selections || []).map((selection: any) => {
              const number = selection.fields.number;
              const relatedProducts = products.filter(
                (product: any) => product.selectionNumber === number
              );

              console.log(selection);
              return {
                ...selection,
                fields: {
                  ...selection.fields,
                  type: selection.fields.product.fields.name.split("::")[2],
                  products: relatedProducts,
                },
              };
            });

            if (supplier.collection_id === collectionId) {
              return {
                supplier_id,
                supplier_cap_id: cap_id,
                collection_id: supplier.collection_id,
                name: supplier.name || "",
                balance: supplier.balance || 0,
                selections: customSelections,
              } as Supplier;
            }

            return {
              supplier_id,
              supplier_cap_id: cap_id,
              collection_id: supplier.collection_id,
              name: supplier.name || "",
              balance: supplier.balance || 0,
              selections: customSelections || [],
            } as Supplier;
          })
        );

        setResult(allSupplierInfo.filter(Boolean) as Supplier[]);
      } catch (e) {
        console.error("Unexpected error during fetch:", e);
        setInternalError(e as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchSupplierInfos();
  }, [data, isPending, error, disabled]);

  return {
    data: result,
    loading,
    error: error || internalError,
  };
};
