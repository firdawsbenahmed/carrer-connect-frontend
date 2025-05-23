"use client";

import React from "react";
import AnimatedNumbers from "react-animated-numbers";

const stats = [
  { number: 500, suffix: "+", label: "Career Paths" },
  { number: 98, suffix: "%", label: "Satisfaction Rate" },
  { number: 50, suffix: "k+", label: "Successful Matches" },
  { number: 24, suffix: "/7", label: "Support Available" },
];

const Stats = () => {
  return (
    <div className='w-full bg-white  py-12'>
      <div className='max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6 text-center'>
        {stats.map((stat, index) => (
          <div key={index}>
            <div className='text-4xl font-extrabold text-black flex justify-center items-baseline'>
              <AnimatedNumbers
                animateToNumber={stat.number}
                includeComma
                fontStyle={{
                  fontSize: 40,
                  fontWeight: 800,
                  color: "black",
                }}
                transitions={(i) => ({
                  type: "spring",
                  duration: 3,
                  delay: i * 0.1,
                })}
              />
              <span className='text-3xl font-extrabold ml-1'>
                {stat.suffix}
              </span>
            </div>
            <p className='mt-2 text-sm text-gray-500'>{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stats;
