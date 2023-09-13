import axios from "axios";
import React from "react";

function Axios(url) {
  const options = {
    method: "GET",
    url: url,
    params: { language: "en-US" },
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0MTJmOTA2M2QyMWMzNjA3MTA2NmFiZDA4OTc1YWRhOSIsInN1YiI6IjY0YThjYmQwNjZhMGQzMDEzYTcxODZlMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.kM5fAUOOAgNG-ksiHipQxGFCkrAfehGubh0d4hH1jpQ",
    },
  };

  axios.request(options).then((res) => res.data);
}

export default Axios;
