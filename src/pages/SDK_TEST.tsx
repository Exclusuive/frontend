import { useGetCollections } from "@/hooks/useGetCollections";
import { useSuiClientQuery } from "@mysten/dapp-kit";

export default function MyComponent() {
  const PACKAGE = "0x233ca438154248974e0e80fbc2c5c92a4baf09d218e9116439b5c0baf71b3bbd";
  const { data, isPending, error } = useSuiClientQuery("getDynamicFields", {
    parentId: PACKAGE,
  });
  console.log(data);

  // const { collections } = useGetCollections();
  // console.log(collections);

  // const { data, isPending, error } = useSuiClientQuery("getObject", {
  //   id: "0xfeefcb8435de7cbe2695367e15e53e08f4389a1f4782c2fe47c91e8c744ff17f",
  //   options: {
  //     showType: true,
  //     showOwner: true,
  //     showContent: true,
  //     showDisplay: true,
  //   },
  // });
  // console.log(data);

  return <div style={{ padding: 20 }}></div>;
}
