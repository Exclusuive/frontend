import { useGetCollections } from "@/hooks/useGetCollections";

export default function MyComponent() {
  // const PACKAGE = "0x80d71658d5dbacef3cf4154d5465a24fc3264fb0388480790854dced69d5f345";
  // const { data, isPending, error } = useSuiClientQuery("getDynamicFields", {
  //   parentId: PACKAGE,
  // });
  // console.log(data);

  const { collections } = useGetCollections();
  console.log(collections);

  return <div style={{ padding: 20 }}></div>;
}
