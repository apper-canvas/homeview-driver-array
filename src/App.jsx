import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import BrowseProperties from "@/components/pages/BrowseProperties";
import PropertyDetail from "@/components/pages/PropertyDetail";
import MapView from "@/components/pages/MapView";
import SavedProperties from "@/components/pages/SavedProperties";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<BrowseProperties />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/saved" element={<SavedProperties />} />
        </Routes>
      </Layout>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        style={{ zIndex: 9999 }}
        toastClassName="text-sm"
      />
    </BrowserRouter>
  );
}

export default App;