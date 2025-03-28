import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import ManageCollection from "./pages/ManageCollection";

export default function Routers() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<ManageCollection />} />
        </Route>
      </Routes>
    </Router>
  );
}
