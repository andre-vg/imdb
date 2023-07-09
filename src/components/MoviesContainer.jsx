import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion as m } from "framer-motion";

function MoviesContainer() {
  const [movies, setMovies] = useState([]);

  const ref = useRef(null);

  const options = {
    method: "GET",
    url: "https://api.themoviedb.org/3/trending/movie/week",
    params: { language: "en-US" },
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MTJmOTA2M2QyMWMzNjA3MTA2NmFiZDA4OTc1YWRhOSIsInN1YiI6IjY0YThjYmQwNjZhMGQzMDEzYTcxODZlMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kM5fAUOOAgNG-ksiHipQxGFCkrAfehGubh0d4hH1jpQ",
    },
  };

  useEffect(() => {
    axios
      .request(options)
      .then(function (response) {
        setMovies(response.data.results);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, []);
  return (
    <>
      <div className="flex flex-col gap-16 p-16 text-5xl font-bold text-woodsmoke-900 dark:text-woodsmoke-100">
        <h1>Trending</h1>
        {/* caroulsel with framer motion */}
        <m.div ref={ref} className="cursor-pointer overflow-x-hidden px-16 py-8 border-b-2 border-opacity-30 border-woodsmoke-300">
          <m.div
            drag="x"
            dragConstraints={{
              right: 0,
              left: -4500,
            }}
            className="flex gap-16"
          >
            {movies.length > 1 ? movies.map((movie) => {
              return (
                <m.div
                  key={movie.id}
                  className="flex min-h-[422px] min-w-[238px] bg-woodsmoke-950 transition-all duration-1000"
                  whileHover={{ filter: "blur(4px)" }}
                >
                  <m.img
                    className="pointer-events-none h-full w-full rounded-xl object-cover "
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt=""
                  />
                </m.div>
              );
            }) : (<h1 className="text-woodsmoke-900 dark:text-woodsmoke-100 text-5xl">loading...</h1>)}
          </m.div>
        </m.div>
      </div>
    </>
  );
}

export default MoviesContainer;
