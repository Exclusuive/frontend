import { AppProvider } from "./provider/provider";
import { AppRouter } from "@/route";

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
