import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "../pages/Home";
import { AnimatePresence } from "framer-motion";
import Movies from "../pages/Movies";
import Series from "../pages/Series";
import Actors from "../pages/Actors";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="movies" element={<Movies />} />
        <Route path="series" element={<Series />} />
        <Route path="actors" element={<Actors />} />
        <Route path="*" element={<h1>Not Found</h1>} /> {/* 404 */}
      </Routes>
    </AnimatePresence>
  );
}

export default AnimatedRoutes;
