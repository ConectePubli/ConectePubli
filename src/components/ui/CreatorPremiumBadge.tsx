import iconPremiumCreator from "@/assets/icons/premium-creator.svg";

export const CreatorPremiumBadge = () => {
  return (
    <div
      className={`inline-flex items-center gap-x-1 px-3 py-1 rounded-full font-bold text-xs cursor-default select-none bg-blue-900 text-white bg-blue-900 text-gray-700 hover:bg-blue-800 
                  `}
    >
      <span>
        <img
          src={iconPremiumCreator}
          alt={"Premium Creator"}
          className="w-6 h-6"
        />
      </span>
      Premium
    </div>
  );
};
