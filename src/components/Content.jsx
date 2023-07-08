import React from "react";

function Content({ doc, title, wiki, awards }) {
  return (
    <div className="flex justify-around gap-8 px-52">
      <div className="flex w-fit flex-col gap-8">
        <h1 className="color-transition w-fit text-5xl font-bold text-neutral-800 dark:text-neutral-200">
          Plot
        </h1>
        <p className="color-transition text-2xl text-neutral-700 dark:text-neutral-300">
          {title.plot}
        </p>
      </div>
      <div className="flex w-fit flex-col gap-8">
        <h1 className="color-transition w-fit text-5xl font-bold text-neutral-800 dark:text-neutral-200">
          Description
        </h1>
        <p className="color-transition line-clamp-[10] text-2xl text-neutral-700 dark:text-neutral-300 ">
          {wiki.plotShort?.plainText}
        </p>
      </div>
    </div>
  );
}

export default Content;
