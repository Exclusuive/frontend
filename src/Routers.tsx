import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import ManageCollection from "./pages/ManageCollection";
import CreateColelction from "./pages/CreateCollectionPage";

export default function Routers() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<ManageCollection />} />
          <Route path="/createcollection" element={<CreateColelction />} />
        </Route>
      </Routes>
    </Router>
  );
}
