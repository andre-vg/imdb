import React from 'react'
import { motion as m } from "framer-motion"

function Series() {
  return (
    <m.div
      //animation modern
      initial={{ opacity: 0, x: 1000 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        ease: "easeOut",
      }}
      exit={{ opacity: 0, x: -1000 }}
    >
      <m.img
        src="https://attackofthefanboy.com/wp-content/uploads/2022/10/Best-Zenyatta-Crosshair-Overwatch-2.jpg"
        alt="Overwatch 2"
      />
    </m.div>
  )
}

export default Series