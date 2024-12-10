import { WhatsappLogo } from "phosphor-react";
import { useEffect, useState } from "react";

function FloatingHelpButton() {
  const [showHelpText, setShowHelpText] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHelpText(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    window.open("https://wa.me/5511913185849", "_blank");
  };

  return (
    <div
      className="fixed bottom-4 right-4 flex items-center justify-center cursor-pointer transition-all duration-300 bg-[#008000] rounded-full p-2"
      onClick={handleClick}
      style={{ zIndex: 9999 }}
    >
      {showHelpText && (
        <div className="text-[#fff] py-2 px-2 rounded-l-md rounded-tr-md shadow-md mr-1 text-base whitespace-nowrap">
          Precisa de ajuda?
        </div>
      )}

      <WhatsappLogo size={30} color="#fff" />
    </div>
  );
}

export default FloatingHelpButton;
