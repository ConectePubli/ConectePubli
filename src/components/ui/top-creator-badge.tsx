import GoldCheckIcon from "@/assets/icons/gold-check.svg";
import GrayCheckIcon from "@/assets/icons/gray-check.svg";
import { useNavigate } from "@tanstack/react-router";

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
      className={`flex items-center px-2 py-1 rounded-full font-bold text-xs cursor-pointer ${
        isActive
          ? "bg-blue-900 text-yellow-300"
          : "bg-white text-gray-700 border border-gray-700 hover:bg-gray-100"
      }`}
    >
      <span className="mr-2 w-4 h-4">
        <img
          src={isActive ? GoldCheckIcon : GrayCheckIcon}
          alt={isActive ? "Gold Check" : "Gray Check"}
          className="w-4 h-4"
        />
      </span>
      {isActive ? "Top Creator" : "Torne-se um Top Creator"}
    </div>
  );
};

export default TopCreatorBadge;
