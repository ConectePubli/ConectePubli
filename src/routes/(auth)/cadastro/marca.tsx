import { useState } from "react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.svg";

import register_marca from "@/assets/register-marca.webp";
import pb from "@/lib/pb";

import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { validateEmail } from "@/utils/validateEmail";
import { getUserType } from "@/lib/auth";

export const Route = createFileRoute("/(auth)/cadastro/marca")({
  component: Page,
  beforeLoad: async () => {
    const userType = await getUserType();

    console.log(userType);

    if (userType === "Brands") {
      throw redirect({
        to: "/dashboard-marca",
      });
    } else if (userType === "Influencers") {
      throw redirect({
        to: "/dashboard-creator",
      });
    }
  },
});

interface Data {
  name: string;
  responsible_name: string;
  email: string;
  phone: string;
}

function Page() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Data>({
    name: "",
    responsible_name: "",
    email: "",
    phone: "",
  });

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!termsAccepted) {
        setErrorMessage("Você deve aceitar os termos e condições.");
        throw new Error("Você deve aceitar os termos e condições.");
      }

      if (!validateEmail(formData.email)) {
        setErrorMessage("O e-mail inserido não é válido.");
        throw new Error("O e-mail inserido não é válido.");
      }

      try {
        await pb
          .collection("Brands_Pre_Registration")
          .getFirstListItem(`email="${formData.email}"`);
        setErrorMessage("Este e-mail já está pré-registrado.");
        throw new Error("Este e-mail já está pré-registrado.");
      } catch (e) {
        console.error("Erro ao verificar e-mail:", e);
      }

      const data = {
        name: formData.name,
        responsible_name: formData.responsible_name,
        email: formData.email,
        cell_phone: formData.phone.replace(/\D/g, ""),
      };

      await pb.collection("Brands_Pre_Registration").create(data);
    },
    onSuccess: () => {
      setShowModal(true);
      setErrorMessage("");
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phone: formattedPhone });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="relative">
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold text-center mb-4 break-words">
              Bem-vindo{formData.name ? `, ${formData.name}` : ""}!
            </h2>
            <p className="text-gray-600 text-center mb-6">
              Seu cadastro foi realizado com sucesso. Em breve liberaremos o
              Login na plataforma para você entrar de maneira simples e rápida.
            </p>
            <Button
              variant="blue"
              size="lg"
              className="w-full"
              onClick={() => {
                setShowModal(false);
                setFormData({
                  name: "",
                  email: "",
                  responsible_name: "",
                  phone: "",
                });
                setTermsAccepted(false);
              }}
            >
              Fechar
            </Button>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 overflow-hidden items-center min-h-screen">
        <div
          className="hidden lg:block w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${register_marca})` }}
        ></div>

        <div className="w-full flex flex-col justify-start overflow-y-auto px-4 py-6 lg:p-12 mx-auto max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2x">
          <Link to="/" className="mb-8 block w-fit">
            <img src={logo} alt="ConectePubli" className="h-7" />
          </Link>

          <h2 className="text-3xl font-bold mb-4">Cadastro para Marcas</h2>
          <p className="text-gray-600 mb-6">
            Junte-se à ConectePubli e conecte sua marca a creators que podem
            amplificar sua mensagem de forma autêntica.
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="brandName"
              >
                Nome da Marca/Empresa
              </label>
              <input
                type="text"
                id="brandName"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Digite o nome da sua marca ou empresa"
                maxLength={50}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="responsibleName"
              >
                Nome do Responsável
              </label>
              <input
                type="text"
                id="responsibleName"
                value={formData.responsible_name}
                onChange={(e) =>
                  setFormData({ ...formData, responsible_name: e.target.value })
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Nome do responsável da marca ou empresa"
                maxLength={50}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="email"
              >
                E-mail de Contato
                <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Informe o e-mail de contato da empresa"
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="telefone"
              >
                Número de Celular/Whatsapp
              </label>
              <input
                type="tel"
                id="telefone"
                value={formData.phone}
                onChange={handlePhoneChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="(XX) XXXXX-XXXX"
                maxLength={15}
              />
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="termos"
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
                className="h-4 w-4 text-customLinkBlue border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="termos"
                className="ml-2 block text-sm text-gray-900"
              >
                Eu aceito os{" "}
                <a
                  className="text-customLinkBlue underline cursor-pointer"
                  onClick={() => navigate({ to: "/termos" })}
                >
                  termos de uso
                </a>{" "}
                e a{" "}
                <a
                  className="text-customLinkBlue underline cursor-pointer"
                  onClick={() => navigate({ to: "/privacidade" })}
                >
                  política de privacidade
                </a>
                .
              </label>
            </div>

            {mutation.isError && (
              <p className="text-red-500" style={{ fontSize: "0.92rem" }}>
                {errorMessage}
              </p>
            )}

            <Button
              variant="blue"
              size="lg"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Enviando..." : "Pré-Cadastro Marcas"}
            </Button>

            <div className="text-left">
              <p className="text-sm hidden">
                Já tem uma conta? (opção escondida até o pós lançamento){" "}
                <a href="/login" className="text-customLinkBlue underline">
                  Faça login
                </a>
                .
              </p>
              <p className="text-sm mt-1">
                É creator? Acesse o{" "}
                <a
                  className="text-customLinkBlue underline cursor-pointer"
                  onClick={() => navigate({ to: "/cadastro/creator" })}
                >
                  formulário de creators
                </a>{" "}
                aqui.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Page;
