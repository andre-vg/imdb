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
    <div className="lexend flex h-[100vh] w-[100vw] flex-col bg-neutral-200 transition-colors duration-300 dark:bg-neutral-900">
      <Header doc={doc} title={title} />
      <Content doc={doc} title={title} wiki={wiki} awards={awards} />
      <button
        className="fixed right-4 top-4 z-10 w-44 rounded-md bg-neutral-100 p-2 shadow-lg dark:bg-neutral-800 dark:text-white"
        onClick={() => {
          document.body.classList.toggle("dark");
        }}
      >
        Toggle Dark Mode
      </button>
    </div>
  );
}
