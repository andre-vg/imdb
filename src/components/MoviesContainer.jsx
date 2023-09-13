import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { motion as m } from "framer-motion";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import Draggable from "react-draggable";

function MoviesContainer() {
  const ref = useRef(null);

  const [isDragging, setIsDragging] = useState(false);

  const navigate = useNavigate();

  const options = {
    method: "GET",
    url: "https://api.themoviedb.org/3/trending/movie/week",
    params: { language: "en-US" },
    headers: {
      accept: "application/json",
      Authorization: import.meta.env.VITE_BEARER,
    },
  };

  const { data, isLoading, error, isFetching } = useQuery("movies", () =>
    axios.request(options).then((res) => res.data.results)
  );
  if (isLoading) return "Loading...";

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
            {data?.map((movie) => {
              return (
                <div
                  key={movie.id}
                  className="flex min-h-[422px] min-w-[238px] rounded-xl bg-woodsmoke-950 shadow-md transition-all duration-300 hover:scale-110 hover:shadow-xl"
                  onDoubleClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate(`/movies/${movie.id}`);
                  }}
                >
                  <m.img
                    className="pointer-events-none h-full w-full rounded-xl object-cover"
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt=""
                  />
                </div>
              );
            })}
          </m.div>
        </m.div>
      </div>
    </>
  );
}

export default MoviesContainer;
