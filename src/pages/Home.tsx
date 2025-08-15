import { useSuiClientQuery } from "@mysten/dapp-kit";

const Homes = () => {
  const { data } = useSuiClientQuery("getObject", {
    id: "0x0e820c764ff2591233658c3e08605653b402f17f8da7a2eedf3dbd7a96c80e6c",
    options: {
      showContent: true,
    },
  });
  console.log(data);

  return <div>Home</div>;
};

export default Homes;
