import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import ManageCollection from "./pages/ManageCollection";
import CreateColelction from "./pages/CreateCollectionPage";
import CollectionDetail from "./pages/CollectionDetail";
import UserMintNFTs from "./pages/UserMintNFT";
import ViewCollections from "./pages/ViewCollections";

export default function Routers() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<ManageCollection />} />
          <Route path="/createcollection" element={<CreateColelction />} />
          <Route path="/collection/:collectionId/:capId" element={<CollectionDetail />} />
          <Route path="/viewcollections" element={<ViewCollections />} />
        </Route>
        <Route path="/mintNFTs/:collectionId" element={<UserMintNFTs />} />
      </Routes>
    </Router>
  );
}
