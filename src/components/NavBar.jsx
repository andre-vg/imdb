import React, { useEffect, useState } from "react";
//import as Logo from "../assets/logo.svg";
import { ReactComponent as Logo } from "../assets/logo.svg";
import logo from "../assets/logo.svg";
import { Link, NavLink } from "react-router-dom";
import { RiSearchLine } from "react-icons/ri";
import { MdDarkMode, MdLightMode } from "react-icons/md";

function NavBar() {
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode");
    if (darkMode === "true") {
      document.body.classList.add("dark");
      setDarkMode(true);
    } else {
      document.body.classList.remove("dark");
      setDarkMode(false);
    }
    if (
      window.matchMedia("(prefers-color-scheme: dark)").matches &&
      !darkMode
    ) {
      document.body.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    document.body.classList.toggle("dark");
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", !darkMode);
  };

  const tabs = [
    {
      name: "Movies",
      path: "/movies",
    },
    {
      name: "Series",
      path: "/series",
    },
    {
      name: "Actors",
      path: "/actors",
    },
  ];

  return (
    <nav className="flex h-28 w-full items-center justify-around border-b-2 border-gray-500 border-opacity-40 bg-neutral-200 shadow-lg dark:bg-woodsmoke-950">
      <div className="w-72">
        <NavLink
          to={"/"}
          className="text-5xl font-black text-woodsmoke-900 dark:text-neutral-100"
        >
          MovieWiki
        </NavLink>
      </div>
      <div className="flex items-center gap-16 text-2xl font-bold">
        {tabs.map((tab) => (
          <NavLink
            key={tab.name}
            to={tab.path}
            className={
              "color-transition text-neutral-800 hover:text-electric-violet-300 aria-[current=page]:text-electric-violet-600 dark:text-neutral-200 dark:text-opacity-50 dark:hover:text-electric-violet-400 dark:aria-[current=page]:text-neutral-200"
            }
          >
            {tab.name}
          </NavLink>
        ))}
      </div>
      <div className=" flex items-center gap-8 text-3xl font-bold dark:text-neutral-200">
        <RiSearchLine />
        <div onClick={toggleDarkMode} className="cursor-pointer">
          {darkMode ? <MdLightMode /> : <MdDarkMode />}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
