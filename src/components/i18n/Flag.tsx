import React from "react";

interface FlagProps {
  image: string;
  isSelected: boolean;
  [key: string]: unknown;
}

const Flag: React.FC<FlagProps> = ({ image, isSelected, ...props }) => (
  console.log("selecionado: ", isSelected),
  (
    <img
      alt="flag"
      src={image}
      className={`
      ${isSelected ? "grayscale-0" : "grayscale"} transition-all duration-300 cursor-pointer
    `}
      {...props}
    />
  )
);

export default Flag;
