import GoldCheckIcon from "@/assets/icons/gold-check.png";
import GrayCheckIcon from "@/assets/icons/gray-check.svg";
import { useNavigate } from "@tanstack/react-router";
import { t } from "i18next";

interface BadgeProps {
  status: true | false;
}

const TopCreatorBadge: React.FC<BadgeProps> = ({ status }) => {
  const navigate = useNavigate();
  const isActive = status === true;

  const handleClick = () => {
    if (!isActive) {
      navigate({ to: "/top-creator" });
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`inline-flex items-center gap-x-1 px-3 py-1 rounded-full font-bold text-xs cursor-default select-none bg-blue-900 text-white ${
        isActive
          ? ""
          : "bg-blue-900 text-gray-700 hover:bg-blue-800 cursor-pointer"
      }`}
    >
      <span>
        <img
          src={isActive ? GoldCheckIcon : GrayCheckIcon}
          alt={isActive ? "Gold Check" : "Gray Check"}
          className="w-6 h-6"
        />
      </span>
      {isActive ? "Top Creator" : t("Torne-se um Top Creator")}
    </div>
  );
};

export default TopCreatorBadge;
