import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Lais from "@/assets/topcreators/Laís.png";
import Vittoria from "@/assets/topcreators/Vittoria.png";
import Thais from "@/assets/topcreators/Thaís.png";
import GoldCheckIcon from "@/assets/icons/gold-check.svg";
import Catarino from "@/assets/topcreators/Catarino.png";
import FelipeMaia from "@/assets/topcreators/FelipeMaia.png";
import Stefano from "@/assets/topcreators/Stefano.png";
import ViviamCostta from "@/assets/topcreators/Viviam.png";
import { useMemo } from "react";

const topCreatorsData = [
  { name: "Laís Crisostomo", imageUrl: Lais },
  { name: "Vittoria Dutra", imageUrl: Vittoria },
  { name: "Thaís Machado", imageUrl: Thais },
  { name: "Diogo Catarino", imageUrl: Catarino },
  {
    name: "Stéfano Agostini",
    imageUrl: Stefano,
  },
  {
    name: "Felipe Maia",
    imageUrl: FelipeMaia,
  },
  {
    name: "Vìviam Costta",
    imageUrl: ViviamCostta,
  },
];

export default function TopCreatorsCarousel() {
  const topCreators = useMemo(() => {
    return topCreatorsData;
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 4,
    slidesToScroll: 2,
    responsive: [
      {
        // até ~1480px
        breakpoint: 1480,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        // até ~1024px
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        // até ~440px (mobile)
        breakpoint: 540,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className="mx-auto mt-4">
      <Slider {...settings}>
        {topCreators
          .sort(() => Math.random() - 0.5)
          .map((creator) => (
            <div key={creator.name} className="p-4">
              <div className="rounded-lg bg-white shadow-sm border">
                <img
                  src={creator.imageUrl}
                  alt={creator.name}
                  className="h-60 w-full object-cover md:h-72 max-sm:h-80 rounded-t-lg"
                />
                <div className="flex items-center justify-center p-4">
                  <p className="mr-2 text-sm font-semibold cursor-default">
                    {creator.name}
                  </p>
                  <img
                    src={GoldCheckIcon}
                    alt="Gold Check"
                    className="w-5 h-5"
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          ))}
      </Slider>
    </section>
  );
}
