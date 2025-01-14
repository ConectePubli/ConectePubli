import React from "react";

interface TestimonialProps {
  imageSrc: string;
  quote: string;
  citedBy: string;
}

const Testimonial: React.FC<TestimonialProps> = ({
  imageSrc,
  quote,
  citedBy,
}) => {
  return (
    <div className="bg-[#354280] rounded-lg h-[210px] flex flex-col justify-between mx-4">
      <div className="p-8 flex flex-col justify-between h-full">
        <div className="flex justify-between items-center">
          <p className="text-white text-lg font-semibold">- {citedBy}</p>
          <img
            src={imageSrc}
            alt={citedBy}
            className="min-w-12 h-14 rounded-md max-w-30"
          />
        </div>
        <p className="text-white italic mt-4 text-base flex-grow flex items-center max-w-[80%]">
          "{quote}"
        </p>
      </div>
    </div>
  );
};

export default Testimonial;
