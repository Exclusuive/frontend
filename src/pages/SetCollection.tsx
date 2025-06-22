import { useAuthStore } from "@/stores/useAuthStore";

const SetCollectionPage = () => {
  const { user } = useAuthStore();
  if (!user) {
    return <div>Please login to continue</div>;
  }
  return (
    <div>
      {user.address} <br /> {user.role}
    </div>
  );
};

export default SetCollectionPage;
