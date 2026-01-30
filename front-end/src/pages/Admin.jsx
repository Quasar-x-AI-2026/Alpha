import { Routes, Route } from "react-router-dom";

import Navbar from "../components/Navbar";
import Login from "../components/admin/Login";
import Dashboard from "../components/admin/Dashboard";

export default function Admin() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="" element={<Login />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}
