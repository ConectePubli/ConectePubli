// src/components/sections/LandingPage/TestimonialSection.tsx

import React from "react";
import Testimonial from "@/components/LandingPage/Testimonial/Testimonial";

import mundo_marketing from "@/assets/mundomarketing.png";
import valor_business from "@/assets/valor-business.jpg";
import forbes_vip from "@/assets/forbesvip.png";
import { t } from "i18next";
import Slider from "react-slick";

interface Testimonial {
  quote: string;
  citedBy: string;
  imageSrc: string;
}

const testimonials: Testimonial[] = [
  {
    quote: t(
      "Com parcerias estratégicas e eliminando barreiras burocráticas, a Conecte Publi busca oferecer segurança e liberdade para todos os seus usuários"
    ),
    citedBy: "Mundo do Marketing",
    imageSrc: mundo_marketing,
  },
  {
    quote: t(
      "Com sua abordagem disruptiva, a Conecte Publi já é considerada uma das maiores inovações no marketing digital em 2025"
    ),
    citedBy: "Valor Business",
    imageSrc: valor_business,
  },
  {
    quote: t(
      "Conecte Publi: A Nova Referência em Marketing de Influência e Conteúdo"
    ),
    citedBy: "Forbes VIP",
    imageSrc: forbes_vip,
  },
];
const settings = {
  dots: true,
  infinite: true,
  speed: 800,
  autoplay: true,
  autoplaySpeed: 6000,
  slidesToShow: 2,
  slidesToScroll: 2,
  responsive: [
    {
      // até ~1480px
      breakpoint: 1480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
    {
      // até ~1024px
      breakpoint: 1024,
      settings: {
        slidesToShow: 1,
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
const TestimonialSection: React.FC = () => {
  return (
    <div className="w-ful md:px-0">
      <Slider {...settings}>
        {testimonials.map((testimonial, index) => (
          <Testimonial
            key={index}
            quote={testimonial.quote}
            citedBy={testimonial.citedBy}
            imageSrc={testimonial.imageSrc}
          />
        ))}
      </Slider>
    </div>
  );
};

export default TestimonialSection;
