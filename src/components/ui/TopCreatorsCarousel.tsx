import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Lais from "@/assets/topcreators/Laís.png";
import Vittoria from "@/assets/topcreators/Vittoria.png";
import Thais from "@/assets/topcreators/Thaís.png";
import Betinho from "@/assets/topcreators/Betinho.png";
import GoldCheckIcon from "@/assets/icons/gold-check.svg";

const topCreators = [
  {
    name: "Laís Crisostomo",
    imageUrl: Lais,
  },
  {
    name: "Vittoria Dutra",
    imageUrl: Vittoria,
  },
  {
    name: "Thaís Machado",
    imageUrl: Thais,
  },
  {
    name: "Betinho Alves",
    imageUrl: Betinho,
  },
  // TODO: Adicionar mais creators
];

export default function TopCreatorsCarousel() {
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
        // até ~1280px
        breakpoint: 1480,
        settings: {
          slidesToShow: 3,
          slideToScroll: 1,
        },
      },
      {
        // até ~1024px
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slideToScroll: 1,
        },
      },
      {
        // até ~640px (mobile)
        breakpoint: 440,
        settings: {
          slidesToShow: 1,
          slideToScroll: 1,
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
                  className="h-60 w-full object-cover md:h-72 rounded-t-lg"
                />
                <div className="flex items-center justify-center p-4">
                  <p className="mr-2 text-sm font-semibold cursor-default">
                    {creator.name}
                  </p>
                  <img
                    src={GoldCheckIcon}
                    alt={"Gold Check"}
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
