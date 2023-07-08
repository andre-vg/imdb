import React from "react";
import Chip from "./Chip";

function Header({ doc, title }) {
  return (
    <>
      <img
        className="h-[40rem] w-full object-cover"
        src={doc.items[1].image}
        alt={doc.items[1].title}
        title={doc.items[1].title}
      />
      <div class="color-transition absolute z-10 h-[40rem] w-full bg-gradient-to-b from-transparent to-neutral-200 dark:to-neutral-900"></div>
      <div className="absolute z-10 mt-96 flex w-full flex-col gap-8 px-24">
        <h1 className="color-transition w-1/2 text-7xl font-bold tracking-tight text-neutral-800 dark:text-neutral-200">
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
