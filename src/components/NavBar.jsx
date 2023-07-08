import React from "react";
//import as Logo from "../assets/logo.svg";
import { ReactComponent as Logo } from "../assets/logo.svg";
import logo from "../assets/logo.svg";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav className="flex h-28 w-full items-center justify-around bg-neutral-900">
      <div className="w-72">
        <img src={logo} alt="logo" />
      </div>
      <div className="flex gap-8 bg-sky-300">
        <Link to={"/movies"}>tela 1</Link>
        <Link to={"/"}>tela 2</Link>
        <a>tela 3</a>
      </div>
      <div className="bg-sky-300">
        <h1>pesquisar</h1>
      </div>
    </nav>
  );
}

export default NavBar;
