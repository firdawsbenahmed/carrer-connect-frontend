"use client";
import Image from "next/image";
import Link from "next/link";

function LandingNavBar() {
  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className='flex items-center justify-between w-full h-16 px-4 md:px-8'>
      <div className='flex items-center'>
        <Image src='/bag.png' alt='bag' width={30} height={30} />
        <p className='ml-2 text-lg font-semibold md:text-xl'>CareerConnect</p>
      </div>

      <ul className='hidden md:flex flex-row justify-center flex-1'>
        <li
          className='mx-4 cursor-pointer hover:text-gray-600'
          onClick={() => handleScroll("features")}
        >
          Features
        </li>
        <li
          className='mx-4 cursor-pointer hover:text-gray-600'
          onClick={() => handleScroll("how-it-works")}
        >
          How it Works
        </li>
        <li
          className='mx-4 cursor-pointer hover:text-gray-600'
          onClick={() => handleScroll("testimonials")}
        >
          Testimonials
        </li>
      </ul>

      <div className='flex items-center space-x-4'>
        <Link
          href='/careermatcher'
          className='px-4 py-2 text-white bg-black rounded-xl hover:bg-gray-700'
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}

export default LandingNavBar;
