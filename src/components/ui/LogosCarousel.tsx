import duh from "@/assets/sponsors/duh.png";
import lamborguini from "@/assets/sponsors/lamborguini.png";
import onocaps from "@/assets/sponsors/onocaps.png";
import scientific from "@/assets/sponsors/scientific.png";
import yourclub from "@/assets/sponsors/yourclub.png";
import wyndham from "@/assets/sponsors/wyndham.png";
import mariaMonteiro from "@/assets/sponsors/maria-monteiro.png";
import phillipp from "@/assets/sponsors/phillipp.png";
import natalia_beauty from "@/assets/sponsors/natalia-beauty.png";

const LogosCarousel = () => {
  const logos = [
    duh,
    lamborguini,
    onocaps,
    scientific,
    yourclub,
    wyndham,
    mariaMonteiro,
    phillipp,
    natalia_beauty
  ];

  const allLogos = [...logos, ...logos, ...logos, ...logos];

  return (
    <div className="relative overflow-hidden py-8 px-4 sm:py-[30px] whitespace-nowrap select-none mx-auto max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
      {/* Left Overlay */}
      <div
        className="absolute top-0 left-0 h-full z-10 pointer-events-none"
        style={{
          width: "50px",
          background: "linear-gradient(to left, rgba(255,255,255,0), #ffffff)",
        }}
      ></div>

      {/* Right Overlay */}
      <div
        className="absolute top-0 right-0 h-full z-10 pointer-events-none"
        style={{
          width: "50px",
          background: "linear-gradient(to right, rgba(255,255,255,0), #ffffff)",
        }}
      ></div>

      {/* Logo Items */}
      <div
        className="inline-block animate-slides"
        onMouseEnter={(e) =>
          (e.currentTarget.style.animationPlayState = "running")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.animationPlayState = "running")
        }
      >
        {allLogos.map((logo, index) => (
          <img
            key={index}
            src={logo}
            alt={`Logo ${index + 1}`}
            className="inline-block max-h-[40px] sm:max-h-[60px] object-contain mx-10 sm:mx-16"
            style={{ width: "auto" }}
            draggable="false"
          />
        ))}
      </div>
    </div>
  );
};

export default LogosCarousel;
