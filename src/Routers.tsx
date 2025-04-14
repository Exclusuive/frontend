import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Dashboard from "./pages/Dashboard";
import CollectionsLayout from "./components/CollectionsLayout";
import Home from "./pages/ManageCollection/Home";
import ManageItemNFT from "./pages/ManageCollection/ManageItemNFT";
import ManageBaseNFT from "./pages/ManageCollection/ManageBaseNFT";
import EditCollectionInfo from "./pages/ManageCollection/EditCollectionInfo";
import ManageSupplierContract from "./pages/ManageCollection/ManageSupplierContract";
export default function Routers() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="collections" element={<CollectionsLayout create={true} />}>
            <Route path="" element={<Home />} />
            <Route path="editinfo" element={<EditCollectionInfo />} />
            <Route path="bases" element={<ManageBaseNFT />} />
            <Route path="items" element={<ManageItemNFT />} />
            <Route path="suppliers" element={<ManageSupplierContract />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
