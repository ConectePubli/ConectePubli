const LogosCarousel = () => {
  const logos = [
    "src/assets/sponsors/duh.png",
    "src/assets/sponsors/lamborguini.png",
    "src/assets/sponsors/onocaps.png",
    "src/assets/sponsors/scientific.png",
    "src/assets/sponsors/yourclub.png",
    "src/assets/sponsors/wyndham.png",
    "src/assets/sponsors/maria-monteiro.png",
  ];

  const allLogos = [...logos, ...logos];

  return (
    <div className="relative overflow-hidden py-8 sm:py-[30px] whitespace-nowrap  mx-auto max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl">
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
          (e.currentTarget.style.animationPlayState = "paused")
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
          />
        ))}
      </div>
    </div>
  );
};

export default LogosCarousel;
