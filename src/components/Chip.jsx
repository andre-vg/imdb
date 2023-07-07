import React from "react";

function Chip({ genre }) {
  return (
    <div>
      <span className="bg-opacity-25 dark:bg-opacity-25 bg-neutral-50 dark:bg-neutral-600 text-neutral-700 dark:text-neutral-200 backdrop-blur-sm color-transition px-4 py-2 rounded-full text-xl font-medium">
        {genre}
      </span>
    </div>
  );
}

export default Chip;
