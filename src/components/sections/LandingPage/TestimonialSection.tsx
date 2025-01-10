// src/components/sections/LandingPage/TestimonialSection.tsx

import React from "react";
import Testimonial from "@/components/LandingPage/Testimonial/Testimonial";

import mundo_marketing from "@/assets/influencers.jpeg";
import valor_business from "@/assets/valor-business.jpg";
import forbes_vip from "@/assets/forbes_vip.jpg";
import { t } from "i18next";

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

const TestimonialSection: React.FC = () => {
  return (
    <div className="w-full px-5 md:px-0">
      {testimonials.map((testimonial, index) => (
        <Testimonial
          key={index}
          imageSrc={testimonial.imageSrc}
          quote={testimonial.quote}
          citedBy={testimonial.citedBy}
        />
      ))}
    </div>
  );
};

export default TestimonialSection;
