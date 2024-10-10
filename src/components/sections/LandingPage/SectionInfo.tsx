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
    <section className="py-8">
      <div
        className={`flex flex-col ${
          reverse ? "lg:flex-row-reverse" : "lg:flex-row"
        } items-center gap-6`}
      >
        <div className="w-full lg:w-[40%]">
          <img
            src={imageSrc}
            alt={title}
            className="rounded-lg shadow-lg w-full h-80 object-cover"
          />
        </div>

        <div
          className="w-full lg:w-[60%]"
          style={reverse ? { paddingRight: "15px" } : { paddingLeft: "15px" }}
        >
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
