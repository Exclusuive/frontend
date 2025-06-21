import { Outlet } from "react-router";

export const ErrorBoundary = () => {
  return <div>오류가 발생했습니다!</div>;
};

export default function AppRoot() {
  return <Outlet />;
}
