import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ThumbnailGallery from "./ThumbnailGallery";
import FullImageView from "./FullImageView";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/"
            element={<ThumbnailGallery />}
          />
          <Route
            path="/view/:imageName"
            element={<FullImageView />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
