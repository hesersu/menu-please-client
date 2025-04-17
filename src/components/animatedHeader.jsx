import React from 'react'
import { motion } from "framer-motion";

export const AnimatedHeader = ({title}) => {

    const letters = title.split("");

  return (
    <>
    <h1 className="text-4xl flex space-x-1 mb-5">
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {letter}
        </motion.span>
      ))}
    </h1>
    </>
  )
}
