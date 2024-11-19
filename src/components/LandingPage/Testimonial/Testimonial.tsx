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
    <div className="w-full md:w-3/5 mx-auto my-8 flex flex-col md:flex-row items-center bg-[#10438F] overflow-hidden rounded-md">
      <div className="w-full md:w-3/5">
        <img
          src={imageSrc}
          alt={`Citação de ${citedBy}`}
          className="w-full h-auto rounded-md object-cover"
        />
      </div>
      <div className="w-full px-5 md:w-2/5 mt-4 md:mt-0 text-left flex flex-col justify-center flex-1 max-sm:pb-5">
        <blockquote className="italic text-lg text-white">"{quote}"</blockquote>
        <cite className="mt-2 block text-base text-white">- {citedBy}</cite>
      </div>
    </div>
  );
};

export default Testimonial;
