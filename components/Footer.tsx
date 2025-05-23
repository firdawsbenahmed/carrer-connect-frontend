import React from "react";
import TextPressure from "./TextPressure/TextPressure";
import ContributorCard from "./ContributorCard";

const Footer = () => {
  return (
    <div className='bg-gradient-to-r flex flex-col justify-center items-center from-[#F8FAFC] to-[#F1F5F9] w-full md:w-11/12 h-auto md:h-9/12 rounded-xs'>
      <div className='mx-6 w-11/12 md:w-8/12'>
        <TextPressure
          text='Contributers'
          flex={true}
          alpha={false}
          stroke={false}
          width={true}
          weight={false}
          italic={true}
          textColor='#00000'
          strokeColor='#000000'
          minFontSize={24}
        />
      </div>
      <div className='flex flex-wrap items-center justify-center gap-6 w-full h-max my-6'>
        <ContributorCard
          name='AISSAOUI Ismail'
          role='Software Engineer'
          image='/user.png'
        />
        <ContributorCard
          name='BOUFAFA Mohamed'
          role='Software Engineer'
          image='/user.png'
        />
        <ContributorCard
          name='BENAHMED Firdaws'
          role='Software Engineer'
          image='/user.png'
        />
        <ContributorCard
          name='KAHIA Tayen'
          role='Software Engineer'
          image='/user.png'
        />
        <ContributorCard
          name='OULD LARBI Rayen'
          role='Software Engineer'
          image='/user.png'
        />
      </div>
    </div>
  );
};

export default Footer;
