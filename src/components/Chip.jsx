import React from "react";

function Chip({ genre }) {
  return (
    <div>
      <span className="color-transition rounded-full bg-neutral-50 bg-opacity-25 px-4 py-2 text-xl font-medium text-neutral-700 backdrop-blur-sm dark:bg-neutral-600 dark:bg-opacity-25 dark:text-neutral-200">
        {genre}
      </span>
    </div>
  );
}

export default Chip;
