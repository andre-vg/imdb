import React from "react";
import Chip from "./Chip";

function Header({doc, title}) {
  return (
    <>
      <img
        className="w-full h-[40rem] object-cover"
        src={doc.items[1].image}
        alt={doc.items[1].title}
        title={doc.items[1].title}
      />
      <div class="absolute w-full bg-gradient-to-b from-transparent to-neutral-200 dark:to-neutral-900 h-[40rem] z-10 color-transition"></div>
      <div className="mt-96 w-full absolute z-10 px-24 flex flex-col gap-8">
        <h1 className="text-7xl text-neutral-800 w-1/2 tracking-tight dark:text-neutral-200 font-bold color-transition">
          {doc.title}
        </h1>
        <div className="flex gap-6">
          {title.genreList.map((genre) => {
            return <Chip key={genre.key} genre={genre.value} />;
          })}
        </div>
      </div>
    </>
  );
}

export default Header;
