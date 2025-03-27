import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import SDK_TEST from "./pages/SDK_TEST";
import Dashboard from "./pages/Dashboard";
import MakeCollectionPage from "./pages/MakeCollectionPage";
import CollectionDetail from "./pages/CollectionDetail";

export default function Routers() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/makecollection" element={<MakeCollectionPage />} />
          <Route path="/collection/:id/:capId" element={<CollectionDetail />} />
          <Route path="/dev" element={<SDK_TEST />} />
        </Route>
        <Route path="/preview/:id" element={<SDK_TEST />} />
      </Routes>
    </Router>
  );
}
