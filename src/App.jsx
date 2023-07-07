import { useEffect } from "react";
import Header from "./components/header";
import Content from "./components/Content";
import doc from "./assets/IMDb-API sample data/Movie/tt10872600/Images tt10872600.json";
import title from "./assets/IMDb-API sample data/Movie/tt10872600/Title tt10872600.json";
import wiki from "./assets/IMDb-API sample data/Movie/tt10872600/Wikipedia tt10872600 en.json";
import awards from "./assets/IMDb-API sample data/Movie/tt10872600/Awards tt10872600.json";

export default function App() {
  //whenever the app is mounted, we want to add the dark class to the body if the user has dark mode enabled
  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.body.classList.add("dark");
    }
  }, []);

  return (
    <div className="w-[100vw] h-[100vh] flex flex-col bg-neutral-200 dark:bg-neutral-900 transition-colors duration-300 lexend">
      <Header doc={doc} title={title} />
      <Content doc={doc} title={title} wiki={wiki} awards={awards} />
      <button
        className="bg-neutral-100 dark:bg-neutral-800 w-44 dark:text-white fixed top-4 right-4 p-2 rounded-md shadow-lg z-10"
        onClick={() => {
          document.body.classList.toggle("dark");
        }}
      >
        Toggle Dark Mode
      </button>
    </div>
  );
}
