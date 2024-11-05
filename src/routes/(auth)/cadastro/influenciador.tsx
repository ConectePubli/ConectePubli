import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

import register_influencer from "@/assets/register-influencer.svg";

import pb from "@/lib/pb";

import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { validateEmail } from "@/utils/validateEmail";

export const Route = createFileRoute("/(auth)/cadastro/influenciador")({
  component: Page,
});

function Page() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!termsAccepted) {
        throw new Error("Você deve aceitar os termos e condições.");
      }

      if (!validateEmail(email)) {
        throw new Error("O e-mail inserido não é válido.");
      }

      const data = {
        name,
        email,
        cell_phone: phone.replace(/\D/g, ""),
      };

      await pb.collection("Influencers_Pre_Registration").create(data);
    },
    onSuccess: () => {
      setShowModal(true);
    },
    onError: (error) => {
      setErrorMessage(
        error.message || "Ocorreu um erro ao fazer o pré-cadastro."
      );
    },
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setPhone(formattedPhone);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="relative">
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold text-center mb-4">
              Bem-vindo{ name ? `, ${name}` : "" }!
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
                setName("");
                setEmail("");
                setPhone("");
                setTermsAccepted(false);
              }}
            >
              Fechar
            </Button>
          </div>
        </div>
      )}

      <div className="h-[calc(100vh-66px)] flex lg:flex-row flex-col overflow-hidden">
        <div className="hidden xl:block xl:w-[50%] overflow-hidden">
          <img
            src={register_influencer}
            alt="Cadastro de Influenciador"
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="w-full xl:w-[50%] flex flex-col items-center bg-white py-8 px-12 lg:py-7 overflow-y-auto max-sm:px-5">
          <div className="w-full min-2xl:max-w-lg">
            <h2 className="text-3xl font-bold mb-4">
              Cadastro para Influenciadores
            </h2>
            <p className="text-gray-600 mb-6">
              Junte-se à ConectePubli e faça parte de uma rede exclusiva de
              influenciadores.
            </p>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="nome"
                >
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Digite o seu nome completo"
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Informe o e-mail de contato"
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
                  value={phone}
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
                  <a href="#" className="text-customLinkBlue underline">
                    termos de uso
                  </a>{" "}
                  e a{" "}
                  <a href="#" className="text-customLinkBlue underline">
                    política de privacidade
                  </a>
                  .
                </label>
              </div>

              {mutation.isError && (
                <p className="text-red-500">{errorMessage}</p>
              )}

              <Button
                variant="orange"
                size="lg"
                className="w-full"
                disabled={mutation.isPending}
              >
                {mutation.isPending
                  ? "Enviando..."
                  : "Pré Cadastro Influenciadores"}
              </Button>

              <div className="text-left">
                <p className="text-sm hidden">
                  Já tem uma conta? (opção escondidade até o pós lançamento){" "}
                  <a href="/login" className="text-customLinkBlue underline">
                    Faça login
                  </a>
                  .
                </p>
                <p className="text-sm mt-1">
                  É uma marca? Acesse o{" "}
                  <a
                    href="#"
                    className="text-customLinkBlue underline"
                    onClick={() => navigate({ to: "/cadastro/marca" })}
                  >
                    formulário de cadastro para marcas
                  </a>{" "}
                  aqui.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
