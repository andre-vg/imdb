import React from "react";
import { motion } from "framer-motion";

function Home() {
  return (
    <motion.section
      id="home"
      initial={{ opacity: 0, x: 1000 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        ease: "easeOut",
      }}
      exit={{ opacity: 0, x: -1000 }}
    >
      <motion.img
        src="https://psxbrasil.com.br/wp-content/uploads/2022/10/Overwatch-2-Kiriko-Animated-Short.jpg"
        alt="Overwatch 2"
      />
    </motion.section>
  );
}

export default Home;
