import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Dashboard from "./pages/Dashboard";
import CollectionsLayout from "./components/CollectionsLayout";
import Home from "./pages/ManageCollection/Home";
import EditCollectionInfo from "./pages/ManageCollection/EditCollectionInfo";
import ManageItemNFT from "./pages/ManageCollection/ManageItemNFT";
import ManageBaseNFT from "./pages/ManageCollection/ManageBaseNFT";
import ManageStoreContract from "./pages/ManageCollection/ManageStoreContract";
import ViewMyNFT from "./pages/VIewNFT/ViewMyNFT";
import ViewStores from "./pages/VIewNFT/ViewStores";
export default function Routers() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="collections" element={<CollectionsLayout manage={true} />}>
            <Route path="" element={<Home />} />
            <Route path="editinfo" element={<EditCollectionInfo />} />
            <Route path="bases" element={<ManageBaseNFT />} />
            <Route path="items" element={<ManageItemNFT />} />
            <Route path="stores" element={<ManageStoreContract />} />
          </Route>
          <Route path="viewnft" element={<CollectionsLayout manage={false} />}>
            <Route path="" element={<ViewMyNFT />} />
            <Route path="stores" element={<ViewStores />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
