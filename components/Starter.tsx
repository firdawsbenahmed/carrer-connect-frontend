import React from "react";
import Image from "next/image";
const Starter = () => {
  return (
    <div className='flex flex-col w-full md:w-11/12 h-auto md:h-9/12 py-12 md:py-16 bg-black justify-center items-center text-white'>
      <h1 className='text-3xl md:text-4xl mb-7 font-extrabold'>
        Ready to Find Your Perfect Career?
      </h1>
      <p className='mx-6 mb-7 text-center'>
        Join thousands of professionals who have discovered their ideal career
        path with CareerMatch.
      </p>
      <button className='flex items-center bg-white  text-black px-6 py-2 rounded-xl hover:opacity-90'>
        <p className='mx-1 text-sm sm:text-base'>Find Your Match</p>
        <Image
          src='/right-black-arrow.png'
          width={10}
          height={10}
          alt='right- arrow'
          className='mx-1'
        ></Image>
      </button>
    </div>
  );
};

export default Starter;
