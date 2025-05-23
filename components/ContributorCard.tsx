import Image from "next/image";
type ContributorCardProps = {
  name: string;
  image: string;
  role?: string;
};

const ContributorCard = ({
  name,
  image,
  role = "software engeneer",
}: ContributorCardProps) => {
  return (
    <div className='bg-white rounded-2xl shadow-md p-4 flex flex-col items-center text-center w-64'>
      <Image
        width={24}
        height={24}
        src={image}
        alt={`${name}'s profile`}
        className=' rounded-full object-cover mb-4 border-4 border-gray-200'
      />
      <h3 className='text-lg font-semibold text-gray-800'>{name}</h3>
      <p className='text-gray-500 text-sm'>{role}</p>
    </div>
  );
};

export default ContributorCard;
