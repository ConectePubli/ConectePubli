import { createFileRoute } from "@tanstack/react-router";

import CompanyIcon from "@/assets/icons/company.svg";
import LocationPin from "@/assets/icons/location-pin.svg";
import { Link } from "lucide-react";
import InstagramIcon from "@/assets/icons/instagram.svg";
import TiktokIcon from "@/assets/icons/tiktok.svg";
import FacebookIcon from "@/assets/icons/facebook.svg";
import CampaignSlider from "@/components/ui/CampaignSlider";

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/(perfis)/marca/$userName/"
)({
  component: Page,
});

function Page() {
  return (
    <div className="flex p-0 flex-col">
      <img
        src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?fit=crop&w=800&q=80"
        alt="imagem"
        className="w-full h-64 object-cover"
      />

      <div>
        {/* BASIC INFO*/}
        <div className="flex flex-row items-center px-4 mt-4">
          <img
            src="https://picsum.photos/200"
            alt="avatar"
            className="w-20 h-20 rounded-md"
          />
          <div className="ml-3">
            <p className="text-gray-500 text-sm font-bold flex flex-row items-center">
              <img
                src={CompanyIcon}
                alt="company icon"
                className="w-3 h-3 mr-1"
              />
              Marca
            </p>
            <h1 className="text-xl font-bold">
              Elevate Visionary Creations Co.
            </h1>
          </div>
        </div>

        {/* LOCATION*/}
        <div className="flex flex-row items-center mt-3 px-4">
          <img src={LocationPin} alt="location pin" className="w-5 h-5 mr-1" />
          <p className="text-orange-600 font-bold text-md">
            Denver, CO, United States
          </p>
        </div>

        {/* LINK */}
        <div className="mt-2 flex flex-row items-center px-4">
          <Link className="text-black mr-2" size={16} />
          <a
            className="text-[#10438F] font-semibold text-md hover:underline"
            href="https://www.elevatevisionarycreations.com"
          >
            elevatevisionarycreations.com
          </a>
        </div>

        {/* REDES SOCIAIS*/}
        <div className="flex flex-wrap gap-2 mt-2 px-4">
          <button className="border border-[#10438F] text-[#10438F] px-3 py-2 text-md rounded-md flex items-center font-semibold hover:bg-[#10438F] hover:text-white transition-colors duration-200">
            <img
              src={InstagramIcon}
              alt="Ícone do Instagram"
              className="w-5 h-5 mr-1"
            />
            Instagram
          </button>

          <button className="border border-[#10438F] text-[#10438F] px-3 py-2 text-md rounded-md flex items-center font-semibold hover:bg-[#10438F] hover:text-white transition-colors duration-200">
            <img
              src={TiktokIcon}
              alt="Ícone do TikTok"
              className="w-5 h-5 mr-1"
            />
            TikTok
          </button>

          <button className="border border-[#10438F] text-[#10438F] px-3 py-2 text-md rounded-md flex items-center font-semibold hover:bg-[#10438F] hover:text-white transition-colors duration-200">
            <img
              src={FacebookIcon}
              alt="Ícone do Facebook"
              className="w-5 h-5 mr-1"
            />
            Facebook
          </button>
        </div>

        <div className="mt-2 w-full max-w-[100dvw]">
          <CampaignSlider
            campaigns={[
              {
                id: "x61069n6r69vq8q",
                objective: "UGC",
                open_jobs: 25,
                name: "Campanha Boticario",
                description: "Essa campanha é para aqueles que....",
                price: 5000,
                beginning: "2024-10-04 12:00:00.000Z",
                end: "2024-10-24 12:00:00.000Z",
                status: "ended",
              },
            ]}
          />
        </div>

        {/* BIOGRAFIA*/}
        <div className="mt-4 px-4">
          <h2 className="text-lg font-bold">Biografia</h2>
          <p className="text-black text-md mt-2">
            Elevate Visionary Creations Co. é uma empresa de criação de conteúdo
            visual com base em Denver, Colorado. Nossa missão é criar conteúdo
            visual de alta qualidade que ajude a elevar a marca de nossos
            clientes.
          </p>
        </div>

        {/* HASHTAGS*/}
        <div className="flex flex-wrap gap-2 mt-2 px-4">
          <button className="bg-[#10438F] text-white px-3 py-2 text-md rounded-md flex items-center font-semibold hover:bg-[#10438F] hover:text-white transition-colors duration-200">
            #Electronics & Apps
          </button>
          <button className="bg-[#10438F] text-white px-3 py-2 text-md rounded-md flex items-center font-semibold hover:bg-[#10438F] hover:text-white transition-colors duration-200">
            #Travel
          </button>
          <button className="bg-[#10438F] text-white px-3 py-2 text-md rounded-md flex items-center font-semibold hover:bg-[#10438F] hover:text-white transition-colors duration-200">
            #Electronics & Apps
          </button>
          <button className="bg-[#10438F] text-white px-3 py-2 text-md rounded-md flex items-center font-semibold hover:bg-[#10438F] hover:text-white transition-colors duration-200">
            #LifeStyle
          </button>
        </div>
      </div>
    </div>
  );
}
