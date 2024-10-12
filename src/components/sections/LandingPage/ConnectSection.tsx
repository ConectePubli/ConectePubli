import React from "react";

import { Button } from "@/components/ui/button";

export const ConnectSection: React.FC = () => {
  return (
    <section className="py-16">
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <div className="flex flex-col md:flex-row w-full lg:w-[50%] gap-4">
          <img
            src="https://via.placeholder.com/300"
            alt="Influencer 1"
            className="rounded-lg shadow-lg w-full h-64 object-cover"
          />
          <img
            src="https://via.placeholder.com/300"
            alt="Influencer 2"
            className="rounded-lg shadow-lg w-full h-64 object-cover"
          />
        </div>

        <div className="w-full lg:w-[50%] text-center lg:text-left">
          <h2 className="text-3xl font-bold mb-4">Conecte-se!</h2>
          <p className="text-gray-700 mb-4">
            Ao se cadastrar no pré-lançamento, você garante acesso prioritário a
            uma plataforma que facilita conexões estratégicas, permitindo que
            você amplifique seu alcance e maximize seu impacto digital. Além de
            garantir sua entrada na plataforma sem taxa de adesão!
          </p>
          <div className="flex flex-col lg:flex-row gap-4 justify-center lg:justify-start">
            <Button
              variant="orange"
              size="lg"
              onClick={() => console.log("Login")}
            >
              Fazer Login
            </Button>
            <Button
              variant="blue"
              size="lg"
              onClick={() => console.log("Registrar")}
            >
              Registrar-se Agora
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
