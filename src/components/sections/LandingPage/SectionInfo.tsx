import React from "react";
import { Button } from "@/components/ui/button";

interface SectionInfoProps {
  imageSrc: string;
  title: string;
  description: React.ReactNode;
  buttonLabel: string;
  buttonVariant: "orange" | "blue";
  buttonOnClick: () => void;
  reverse?: boolean;
}

export const SectionInfo: React.FC<SectionInfoProps> = ({
  imageSrc,
  title,
  description,
  buttonLabel,
  buttonVariant,
  buttonOnClick,
  reverse = false,
}) => {
  return (
    <section className="py-12 mx-auto max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl px-4">
      <div
        className={`flex flex-col ${
          reverse ? "lg:flex-row-reverse" : "lg:flex-row"
        } gap-6`}
      >
        <div className="w-full md:w-[50%] lg:w-[40%]">
          <img
            src={imageSrc}
            alt={title}
            className="rounded-lg shadow-lg w-full h-full object-cover"
          />
        </div>

        <div className={`w-full lg:w-[60%]`}>
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <div className="text-gray-700 mb-8 space-y-4">
            <div className="flex flex-col space-y-2">
              {React.Children.map(description, (child, index) => (
                <p key={index}>{child}</p>
              ))}
            </div>
          </div>

          <Button
            variant={buttonVariant}
            size="default"
            onClick={buttonOnClick}
          >
            {buttonLabel}
          </Button>
        </div>
      </div>
    </section>
  );
};
