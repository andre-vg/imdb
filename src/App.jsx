import { useEffect } from "react";
import NavBar from "./components/NavBar";
import AnimatedRoutes from "./components/AnimatedRoutes";
import { BrowserRouter } from "react-router-dom";

export default function App() {
  //whenever the app is mounted, we want to add the dark class to the body if the user has dark mode enabled
  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.body.classList.add("dark");
    }
  }, []);

  return (
    <div id="app">
      <BrowserRouter>
        <NavBar />
        <AnimatedRoutes />
      </BrowserRouter>
    </div>
  );
}
