import { UserAuth } from "@/types/UserAuth";
import { createFileRoute, useMatch, useNavigate } from "@tanstack/react-router";
import { MapPin, Globe, User } from "lucide-react";
import {
  InstagramLogo,
  TiktokLogo,
  FacebookLogo,
  Hourglass,
  GenderIntersex,
  Image,
  Tag,
} from "phosphor-react";
import { useEffect, useState } from "react";

import pb from "@/lib/pb";
import { useMutation } from "@tanstack/react-query";
import Spinner from "@/components/ui/Spinner";
import { Influencer } from "@/types/Influencer";
import { Niche } from "@/types/Niche";

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/(perfis)/influenciador/$username/"
)({
  component: InfluencerProfilePage,
});

function InfluencerProfilePage() {
  const navigate = useNavigate();

  const {
    params: { username },
  } = useMatch({
    from: "/(dashboard)/_side-nav-dashboard/influenciador/$username/",
  });

  const [influencer, setInfluencer] = useState<Influencer | null>(null);
  const [userLogged, setUserLogged] = useState<UserAuth | null>(null);

  const returnGender = (gender: string) => {
    switch (gender) {
      case "male":
        return "Homem";
      case "female":
        return "Mulher";
      case "non-binary":
        return "Não-binário";
    }
  };

  const getUserInfo = async () => {
    const user: UserAuth = JSON.parse(
      localStorage.getItem("pocketbase_auth") as string
    );

    setUserLogged(user);

    try {
      const influencerData = await pb.collection("Influencers").getFullList({
        filter: `username="${username}"`,
        expand: "niche",
      });

      return influencerData[0];
    } catch (e) {
      console.log(`error get user info: ${e}`);
      throw e;
    }
  };

  const calculateAge = (birthDateString: string) => {
    if (!birthDateString) return "N/A";
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const mutate = useMutation({
    mutationFn: async () => {
      const data = await getUserInfo();
      setInfluencer(data as unknown as Influencer);
      return data;
    },
    onError: (error) => {
      console.log(`Mutation error: ${error}`);
    },
  });

  useEffect(() => {
    mutate.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  // const toggleFAQ = (index: number) => {
  //   setOpenFAQ(openFAQ === index ? null : index);
  // };

  // const faqs = [
  //   {
  //     question: "What is the difference between a UI and UX Designer?",
  //     answer:
  //       "UI refers to User Interface, which deals with the visual aspects of a design, while UX stands for User Experience, focusing on the overall feel and functionality of a product.",
  //   },
  //   {
  //     question: "How can I improve my UX design skills?",
  //     answer:
  //       "Improving UX design skills requires practicing empathy with users, conducting usability tests, learning design principles, and keeping up with industry trends.",
  //   },
  //   {
  //     question: "What tools do UI/UX designers use?",
  //     answer:
  //       "UI/UX designers commonly use tools like Figma, Sketch, Adobe XD, and InVision for design, prototyping, and collaboration.",
  //   },
  //   {
  //     question: "What is user research?",
  //     answer:
  //       "User research involves gathering insights about user needs, behaviors, and motivations through interviews, surveys, and usability tests to inform design decisions.",
  //   },
  //   {
  //     question: "How do you handle accessibility in design?",
  //     answer:
  //       "Accessibility in design ensures that products are usable by people with disabilities, by following guidelines like WCAG, ensuring proper contrast, and providing assistive technology support.",
  //   },
  // ];

  if (mutate.isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (mutate.isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-center">
          Erro ao carregar as informações do Influencer
        </p>
      </div>
    );
  }

  if (!influencer) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-center">
          Esta página ou não existe ou foi removida, tente novamente!
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="relative">
          {influencer.background_img ? (
            <img
              src={pb.getFileUrl(influencer, influencer.background_img)}
              alt="Cover Image"
              className="w-full h-48 object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gray-300 flex items-center-justify-center">
              <Image size={40} color="#fff" />
            </div>
          )}

          {influencer.profile_img ? (
            <div className="absolute left-6 bottom-0 transform translate-y-1/2">
              <img
                src={pb.getFileUrl(influencer, influencer.profile_img)}
                alt={influencer.full_name}
                className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
              />
            </div>
          ) : (
            <div className="absolute left-6 bottom-0 transform translate-y-1/2 bg-gray-300 flex items-center justify-center">
              <User color="#fff" size={20} />
            </div>
          )}
        </div>

        <div className="px-6 py-12">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-medium mb-2">{influencer.name} </h2>
              <p className="text-sm text-orange-500 flex items-center mb-1">
                <MapPin className="inline-block w-4 h-4 text-orange-500 mr-1" />
                {influencer.city}, {influencer.state}, {influencer.country}{" "}
              </p>
              <p className="text-sm text-gray-600 flex items-center">
                <Tag className="mr-1 w-4 h-4" /> {influencer.account_type}{" "}
              </p>
            </div>
            <div className="flex space-x-2">
              {influencer.instagram_url && (
                <a
                  href={influencer.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition flex items-center">
                    <InstagramLogo className="inline-block w-5 h-5 mr-1" />{" "}
                    Instagram
                  </button>
                </a>
              )}
              {influencer.tiktok_url && (
                <a
                  href={influencer.tiktok_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="bg-gray-900 text-white px-3 py-1 rounded-full hover:bg-gray-800 transition">
                    <TiktokLogo className="inline-block w-5 h-5" /> Tiktok
                  </button>
                </a>
              )}
              {influencer.facebook_url && (
                <a
                  href={influencer.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition">
                    <FacebookLogo className="inline-block w-5 h-5" /> Facebook
                  </button>
                </a>
              )}
            </div>
          </div>

          <div className="flex justify-between mb-4">
            {influencer.media_kit_url && (
              <a
                href={influencer.media_kit_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition">
                  Acessar mídia kit
                </button>
              </a>
            )}

            {userLogged?.model.id.includes(influencer.id) && (
              <button
                className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg shadow-md hover:bg-gray-200 transition"
                onClick={() =>
                  navigate({ to: `/influenciador/${username}/editar` })
                }
              >
                Editar Perfil
              </button>
            )}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Biografia</h3>

            <div className="flex items-center gap-4 flex-wrap mb-1">
              <p className="text-sm text-gray-600 font-medium flex items-center">
                <MapPin className="inline-block w-4 h-4 text-gray-500 mr-1" />{" "}
                {influencer.country}, {influencer.state}
              </p>
              <p className="text-sm text-gray-600 font-medium flex items-center">
                <Globe className="inline-block w-4 h-4 text-gray-500 mr-1" />{" "}
                Idioma:{" "}
                {influencer.languages && influencer.languages.length > 0
                  ? influencer.languages.join(", ")
                  : "N/A"}{" "}
              </p>
              <p className="text-sm text-gray-600 font-medium  flex items-center">
                <Hourglass className="inline-block w-4 h-4 text-gray-500 mr-1" />{" "}
                Idade: {calculateAge(influencer.birth_date)}
              </p>
              <p className="text-sm text-gray-600 font-medium  flex items-center">
                <GenderIntersex className="inline-block w-4 h-4 text-gray-500 mr-1" />{" "}
                {returnGender(influencer.gender)}
              </p>
            </div>

            <p className="text-base text-black leading-relaxed">
              {influencer.bio}
            </p>

            {influencer.expand && influencer.expand.niche && (
              <div className="mt-4">
                <div className="flex flex-wrap gap-2">
                  {influencer.expand.niche.map((niche: Niche) => {
                    return (
                      <span
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        key={niche.id}
                      >
                        {niche.niche}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* <div className="mt-6">
              <h4 className="text-lg font-semibold mb-2">Minhas Habilidades</h4>
              <div className="flex flex-wrap gap-2">
                {influencer.skills &&
                  influencer.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
                    >
                      {skill.name} (nota {skill.rating})
                    </span>
                  ))}
              </div>
            </div> */}

            {/* <div className="mt-6">
              <h4 className="text-lg font-semibold mb-2">
                Marcas que já trabalhei com
              </h4>
            </div> */}

            <div className="mt-6 border-t-2 p-2">
              <h4 className="text-lg font-semibold mb-2">Portfólio</h4>
              {influencer.previous_work_imgs &&
              influencer.previous_work_imgs.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {influencer.previous_work_imgs.map((img, index) => (
                    <img
                      key={index}
                      src={pb.getFileUrl(influencer, img)}
                      alt={`Portfolio ${index}`}
                      className="w-full h-[500px] rounded-md object-cover"
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Nenhuma imagem no portfólio.</p>
              )}
            </div>

            {/* <div className="mt-6">
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
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfluencerProfilePage;
