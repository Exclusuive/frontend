const CollectionStats = [
  {
    name: "Daily Collections",
    value: 100,
    delta: 123,
  },
  {
    name: "NFTs",
    value: 223,
    delta: 112,
  },
  {
    name: "Users",
    value: 3654,
    delta: 100,
  },
];

const AdminDashboard = () => {
  return (
    <div className="flex flex-col gap-4 p-10">
      <div className="flex items-center justify-between gap-4">
        {CollectionStats.map((stat) => (
          <div className="flex h-[150px] w-1/4 min-w-[320px] flex-col items-center justify-center gap-2 rounded-lg bg-gray-200 p-8 md:flex-row">
            <h1 className="text-2xl font-bold">{stat.name}</h1>
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-2xl font-bold">{stat.value}</h1>{" "}
              <span className="text-sm text-green-500">{stat.delta}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
