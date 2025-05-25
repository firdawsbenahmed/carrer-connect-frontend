"use client";
import Image from "next/image";
import Link from "next/link";

function NavBar() {
  return (
    <div className='flex items-center justify-between w-full h-16 px-4 md:px-8'>
      <div className='flex items-center'>
        <Image src='/bag.png' alt='bag' width={30} height={30} />
        <p className='ml-2 text-lg font-semibold md:text-xl'>CareerConnect</p>
      </div>

      <ul className='hidden md:flex flex-row justify-center flex-1'>
        <Link href='/' className='mx-4 hover:text-gray-600'>
          Home
        </Link>
        <Link href='/careermatcher' className='mx-4 hover:text-gray-600'>
          Career Matcher
        </Link>
        <Link href='/cv-upload' className='mx-4 hover:text-gray-600'>
          CV Ranking
        </Link>
      </ul>

      <div className='flex items-center'>
        <Link href='/' className='px-4 py-2 text-black hover:text-gray-600'>
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NavBar;
