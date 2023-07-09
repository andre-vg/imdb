import React from "react";
import { motion as m } from "framer-motion";
import MoviesLeftDiv from "../components/MoviesLeftDiv";
import MoviesContainer from "../components/MoviesContainer";

function Movies() {
  return (
    <m.div
      //animation modern
      initial={{ opacity: 0, x: 1000 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        ease: "easeOut",
      }}
      exit={{ opacity: 0, x: -1000 }}
    >
      <section className="flex bg-woodsmoke-100 dark:bg-woodsmoke-950">
        <div className="w-[30%] flex flex-col">
          <MoviesLeftDiv />
        </div>
        <div className="w-[70%] border-l-2 border-opacity-30 border-woodsmoke-400">
          <MoviesContainer />
        </div>
      </section>
    </m.div>
  );
}

export default Movies;
