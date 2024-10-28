import { createFileRoute, Navigate, useMatch } from "@tanstack/react-router";
import { MapPin, Edit2, Globe, ChevronDown } from "lucide-react";
import {
  InstagramLogo,
  TiktokLogo,
  FacebookLogo,
  User,
  Hourglass,
  GenderIntersex,
} from "phosphor-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/(perfis)/influenciador/$username/"
)({
  component: InfluencerProfilePage,
});

function InfluencerProfilePage() {
  const {
    params: { username },
  } = useMatch({
    from: "/(dashboard)/_side-nav-dashboard/influenciador/$username/",
  });

  useEffect(() => {
    console.log(username);
  });

  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqs = [
    {
      question: "What is the difference between a UI and UX Designer?",
      answer:
        "UI refers to User Interface, which deals with the visual aspects of a design, while UX stands for User Experience, focusing on the overall feel and functionality of a product.",
    },
    {
      question: "How can I improve my UX design skills?",
      answer:
        "Improving UX design skills requires practicing empathy with users, conducting usability tests, learning design principles, and keeping up with industry trends.",
    },
    {
      question: "What tools do UI/UX designers use?",
      answer:
        "UI/UX designers commonly use tools like Figma, Sketch, Adobe XD, and InVision for design, prototyping, and collaboration.",
    },
    {
      question: "What is user research?",
      answer:
        "User research involves gathering insights about user needs, behaviors, and motivations through interviews, surveys, and usability tests to inform design decisions.",
    },
    {
      question: "How do you handle accessibility in design?",
      answer:
        "Accessibility in design ensures that products are usable by people with disabilities, by following guidelines like WCAG, ensuring proper contrast, and providing assistive technology support.",
    },
  ];

  const influencer = {
    name: "Elevate Visionary Creations Co.",
    location: "Denver, CO, United States",
    type: "Creator/Influencer",
    niche: "UGC e Influencer",
    socialLinks: {
      instagram: "https://instagram.com",
      tiktok: "https://tiktok.com",
      facebook: "https://facebook.com",
    },
    audience: "0,1k",
    bio: "Local, MG",
    idiom: "Portugues",
    age: 28,
    gender: "Mulher",
    profileImage: "https://via.placeholder.com/80",
    coverImage: "https://via.placeholder.com/600",
    hashtags: [
      "#Electronics & Apps",
      "#Entertainment",
      "#Fitness",
      "#Lifestyle",
      "#Travel",
      "#Pets",
    ],
    skills: [
      { name: "Edição de vídeo", rating: 10 },
      { name: "Design gráfico", rating: 9 },
      { name: "Programação em Python", rating: 8 },
      { name: "Gestão de projetos", rating: 9 },
    ],
  };

  return (
    <div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="relative">
          <img
            src={influencer.coverImage}
            alt="Cover Image"
            className="w-full h-48 object-cover"
          />
          <div className="absolute left-6 bottom-0 transform translate-y-1/2">
            <img
              src={influencer.profileImage}
              alt={influencer.name}
              className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
            />
          </div>
        </div>

        <div className="px-6 py-12">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold">
                {influencer.name}{" "}
                <Edit2 className="inline-block w-4 h-4 text-gray-500 cursor-pointer" />
              </h2>
              <p className="text-sm text-gray-600">
                <MapPin className="inline-block w-4 h-4 text-orange-500 mr-1" />
                {influencer.location}{" "}
                <Edit2 className="inline-block w-4 h-4 text-gray-500 cursor-pointer" />
              </p>
              <p className="text-sm text-gray-600">
                {influencer.niche}{" "}
                <Edit2 className="inline-block w-4 h-4 text-gray-500 cursor-pointer" />
              </p>
            </div>
            <div className="flex space-x-2">
              <a
                href={influencer.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition">
                  <InstagramLogo className="inline-block w-5 h-5" /> Instagram
                </button>
              </a>
              <a
                href={influencer.socialLinks.tiktok}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="bg-gray-900 text-white px-3 py-1 rounded-full hover:bg-gray-800 transition">
                  <TiktokLogo className="inline-block w-5 h-5" /> Tiktok
                </button>
              </a>
              <a
                href={influencer.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition">
                  <FacebookLogo className="inline-block w-5 h-5" /> Facebook
                </button>
              </a>
            </div>
          </div>

          <div className="flex justify-between mb-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition">
              Acessar midia kit
            </button>
            <button
              className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg shadow-md hover:bg-gray-200 transition"
              onClick={() => Navigate({ to: "/editar" })}
            >
              Editar Perfil
            </button>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Biografia</h3>
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-600 flex items-center">
                <MapPin className="inline-block w-4 h-4 text-gray-500 mr-1" />{" "}
                {influencer.bio}
              </p>
              <p className="text-sm text-gray-600 flex items-center">
                <User className="inline-block w-4 h-4 text-gray-500 mr-1" />{" "}
                Audiência: {influencer.audience}
              </p>
              <p className="text-sm text-gray-600 flex items-center">
                <Globe className="inline-block w-4 h-4 text-gray-500 mr-1" />{" "}
                {influencer.idiom}
              </p>
              <p className="text-sm text-gray-600 flex items-center">
                <Hourglass className="inline-block w-4 h-4 text-gray-500 mr-1" />{" "}
                Idade: {influencer.age}
              </p>
              <p className="text-sm text-gray-600 flex items-center">
                <GenderIntersex className="inline-block w-4 h-4 text-gray-500 mr-1" />{" "}
                Gênero: {influencer.gender}
              </p>
            </div>

            <div className="mt-4">
              <h4 className="text-lg font-semibold mb-2">Interesses</h4>
              <div className="flex flex-wrap gap-2">
                {influencer.hashtags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-2">Minhas Habilidades</h4>
              <div className="flex flex-wrap gap-2">
                {influencer.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
                  >
                    {skill.name} (nota {skill.rating})
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-2">
                Marcas que já trabalhei com
              </h4>
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-2">Portfólio</h4>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">FAQ</h3>
              <div>
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 mb-2 p-4 rounded-lg cursor-pointer"
                    onClick={() => toggleFAQ(index)}
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-semibold">{faq.question}</p>
                      <ChevronDown
                        className={`transition-transform duration-300 ${
                          openFAQ === index ? "transform rotate-180" : ""
                        }`}
                      />
                    </div>
                    {openFAQ === index && (
                      <p className="text-sm mt-2 text-gray-600">{faq.answer}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
