import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion as m } from "framer-motion";
import { LinearProgress } from "@mui/material";

function MoviesContainer() {
  const [movies, setMovies] = useState([]);
  const [isHovering, setIsHovering] = useState(0);

  const ref = useRef(null);

  const options = {
    method: "GET",
    url: "https://api.themoviedb.org/3/trending/movie/week",
    params: { language: "en-US" },
    headers: {
      accept: "application/json",
      Authorization: import.meta.env.VITE_API,
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
        <m.div
          ref={ref}
          className="cursor-pointer overflow-x-hidden border-b-2 border-woodsmoke-300 border-opacity-30 px-16 py-8"
        >
          <m.div
            drag="x"
            dragConstraints={{
              right: 0,
              left: -4500,
            }}
            className="flex gap-12"
          >
            {movies.length > 1 ? (
              movies.map((movie) => {
                return (
                  <m.div
                    key={movie.id}
                    className={`flex min-h-[422px] min-w-[238px]`}
                    onHoverStart={() => {
                      setIsHovering(movie.id);
                    }}
                    onHoverEnd={() => setIsHovering(0)}
                  >
                    {/* //   <m.img
                  //     className="pointer-events-none h-full w-full rounded-xl object-cover "
                  //     src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  //     alt=""
                //   /> */}

                    <m.div
                      style={{
                        backgroundImage: `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        filter:
                          isHovering === movie.id ? "blur(4px)" : "blur(0px)",
                        opacity: isHovering === movie.id ? "0.5" : "1",
                        transition: "all 0.5s ease",
                      }}
                      className={`flex h-full w-full flex-col`}
                    />
                    <m.div
                      className={`absolute flex h-[422px] w-[238px] flex-col justify-end gap-4 p-4 transition-opacity duration-500 ${
                        isHovering === movie.id ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <h4 className="text-center text-3xl font-bold text-woodsmoke-100">
                        {movie.title}
                      </h4>
                    </m.div>
                  </m.div>
                );
              })
            ) : (
              <>
              {
                <LinearProgress
                  className="w-full"
                  color="inherit"
                  variant="indeterminate"
                />

              }
              </>
            )}
          </m.div>
        </m.div>
      </div>
    </>
  );
}

export default MoviesContainer;
