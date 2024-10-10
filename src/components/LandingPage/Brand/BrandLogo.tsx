import React from "react";

interface BrandLogoProps {
  imageSrc: string;
  altText: string;
  link: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  imageSrc,
  altText,
  link,
}) => {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="block hover:opacity-80 transition-opacity duration-300 w-[1/4]"
    >
      <img src={imageSrc} alt={altText} className="h-16 md:h-20 mx-auto" />
    </a>
  );
};
