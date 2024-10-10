import React from "react";

interface FeatureCardProps {
  imageSrc: string;
  title: string;
  description: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  imageSrc,
  title,
  description,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img src={imageSrc} alt={title} className="w-full h-56 object-cover" />
      <div className="px-4 py-6">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-600 mt-2">{description}</p>
      </div>
    </div>
  );
};
