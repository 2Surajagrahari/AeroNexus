"use client";
import React from "react";
import { motion } from "motion/react";


export const TestimonialsColumn = (props) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6">
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div
                  className="p-8 rounded-2xl border border-gray-800/50 bg-gray-900/50 backdrop-blur-sm max-w-xs w-full"
                  key={i}>
                  <div className="text-sm leading-relaxed" style={{ color: '#9ca3af' }}>{text}</div>
                  <div className="flex items-center gap-3 mt-5">
                    <img
                      width={40}
                      height={40}
                      src={image}
                      alt={name}
                      className="h-10 w-10 rounded-full border border-gray-700" />
                    <div className="flex flex-col">
                      <div className="font-medium text-sm tracking-tight leading-5 text-white">{name}</div>
                      <div className="text-xs leading-5 tracking-tight" style={{ color: '#6b7280' }}>{role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};

;