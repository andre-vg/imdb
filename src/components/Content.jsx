import React from "react";

function Content({ doc, title, wiki, awards }) {
  return (
    <div className="px-52 flex justify-around gap-8">
      <div className="w-fit flex flex-col gap-8">
        <h1 className="text-5xl w-fit text-neutral-800 dark:text-neutral-200 font-bold color-transition">
          Plot
        </h1>
        <p className="text-2xl text-neutral-700 dark:text-neutral-300 color-transition">
          {title.plot}
        </p>
      </div>
      <div className="w-fit flex flex-col gap-8">
        <h1 className="text-5xl w-fit text-neutral-800 dark:text-neutral-200 font-bold color-transition">
          Description
        </h1>
        <p className="text-2xl text-neutral-700 dark:text-neutral-300 color-transition line-clamp-[10] ">
          {wiki.plotShort?.plainText}
        </p>
      </div>
    </div>
  );
}

export default Content;
