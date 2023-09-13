import axios from "axios";
import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { motion as m } from "framer-motion";

function SelectedMovie() {
  const { movieId } = useParams();

  const options = {
    method: "GET",
    url: `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
    params: { language: "en-US" },
    headers: {
      accept: "application/json",
      Authorization: import.meta.env.VITE_BEARER,
    },
  };

  const { isLoading, error, isFetching, data } = useQuery(
    ["movie", movieId],
    () => axios.request(options).then((res) => res.data)
  );
  if (isLoading) return "Loading...";

  return (
    <m.div
      initial={{ opacity: 0, x: 1000 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        ease: "easeOut",
      }}
      exit={{ opacity: 0, x: -1000 }}
    >
      <p>{data.title}</p>
    </m.div>
  );
}

export default SelectedMovie;
