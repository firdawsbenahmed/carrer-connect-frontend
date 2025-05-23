import Image from "next/image";
import TextPressure from "./TextPressure/TextPressure";

const Features = () => {
  return (
    <div className='bg-gradient-to-r from-[#F8FAFC] to-[#F1F5F9] w-full md:w-11/12 h-auto md:h-9/12 rounded-xs'>
      <section id='features'>
        <div className='flex flex-col items-center justify-center my-12 md:my-24'>
          <div className='flex items-center border rounded-3xl p-1 bg-black text-white w-fit mx-auto md:mx-0 mb-6'>
            <div className='mx-2 text-sm sm:text-base md:text-lg'>Features</div>
          </div>

          <div className='mx-6 w-8/12 '>
            <TextPressure
              text=' Why  Choose  CareerConnect?'
              flex={true}
              alpha={false}
              stroke={false}
              width={true}
              weight={false}
              italic={true}
              textColor='#00000'
              strokeColor='#000000'
              minFontSize={36}
            />
          </div>
          <p className='mt-4 mx-4 sm:mx-12 md:mx-28 text-center text-xs sm:text-sm md:text-base lg:text-lg text-neutral-600'>
            Our platform offers unique features designed to help you find the
            perfect career match.
          </p>
        </div>
        {/* Features */}
        <div className='flex flex-col md:flex-row mx-4 md:mx-20 my-12 md:my-24 justify-between'>
          <div className='rounded-xl mb-3 md:w-1/4 border-t-4 p-6 bg-white text-left shadow-sm'>
            <Image
              src='/target.png'
              width={50}
              height={50}
              alt='personalized'
              className='mb-4'
            />
            <h3 className='text-lg font-semibold text-black mb-2'>
              AI-Powered Matching
            </h3>
            <p className='text-base text-gray-500 leading-relaxed'>
              Our advanced algorithm analyzes your skills and preferences to
              find the most suitable career options.
            </p>
          </div>
          <div className='rounded-xl md:w-1/4 mb-3 border-t-4 p-6 bg-white text-left shadow-sm'>
            <Image
              src='/stats.png'
              width={50}
              height={50}
              alt='personalized'
              className='mb-4'
            />
            <h3 className='text-lg font-semibold text-black mb-2'>
              Detailed Insights
            </h3>
            <p className='text-base text-gray-500 leading-relaxed'>
              Get comprehensive information about salary ranges, growth
              potential, and required skills.
            </p>
          </div>
          <div className='rounded-xl md:w-1/4 mb-3 border-t-4 p-6 bg-white text-left shadow-sm'>
            <Image
              src='/person.png'
              width={50}
              height={50}
              alt='personalized'
              className='mb-4'
            />
            <h3 className='text-lg font-semibold text-black mb-2'>
              Personalized Guidance
            </h3>
            <p className='text-base text-gray-500 leading-relaxed'>
              Receive tailored recommendations and resources to help you pursue
              your ideal career path.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
