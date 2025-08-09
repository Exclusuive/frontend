import { useSuiClientQuery } from "@mysten/dapp-kit";

const Homes = () => {
  const { data } = useSuiClientQuery("getObject", {
    id: "0x4c8b2f68629f408b598568d38e0eef710ad6c784604dfae82f04a94cfe1f1262",
    options: {
      showType: true,
      showContent: true,
    },
  });
  console.log(data);

  return <div>Home</div>;
};

export default Homes;
