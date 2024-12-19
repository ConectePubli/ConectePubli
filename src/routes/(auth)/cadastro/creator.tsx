import { useState } from "react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.svg";
import register_influencer from "@/assets/register-influencer.webp";
import pb from "@/lib/pb";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { validateEmail } from "@/utils/validateEmail";
import { getUserType } from "@/lib/auth";
import { ClientResponseError } from "pocketbase";
import { Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/(auth)/cadastro/creator")({
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

function Page() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

      const data = {
        name: formData.name,
        email: formData.email,
        cell_phone: formData.phone.replace(/\D/g, ""),
        password: formData.password,
        passwordConfirm: formData.confirmPassword,
      };

      await pb.collection("Influencers").create(data);
    },
    onSuccess: () => {
      navigate({ to: "/login" });
      setErrorMessage("");
    },
    onError: (error) => {
      const err = error as ClientResponseError;
      console.error("Erro ao criar conta de marca:", JSON.stringify(err));
      if (err.data.data.email.code === "validation_invalid_email") {
        setErrorMessage("Este e-mail já está em uso ou é inválido.");
      } else {
        setErrorMessage(`Ocorreu um erro ao criar a conta. ${err.message}`);
      }
    },
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phone: formattedPhone });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!termsAccepted) {
      setErrorMessage("Você deve aceitar os termos e condições.");
      return;
    }

    if (!validateEmail(formData.email)) {
      setErrorMessage("O e-mail inserido não é válido.");
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage("A senha precisa ter mais que 8 caracteres.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("As senhas não coincidem.");
      return;
    }
    mutation.mutate();
  };

  return (
    <div className="relative">
      <div className="grid lg:grid-cols-2 overflow-hidden items-center min-h-screen">
        <div
          className="hidden lg:block w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${register_influencer})` }}
        ></div>

        <div className="w-full flex flex-col justify-start overflow-y-auto px-4 py-6 lg:p-12 mx-auto max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2x">
          <Link to="/" className="mb-8 block w-fit">
            <img src={logo} alt="ConectePubli" className="h-7" />
          </Link>

          <h2 className="text-3xl font-bold mb-4">Cadastro para Creators</h2>
          <p className="text-gray-600 mb-6">
            Junte-se à ConectePubli e faça parte de uma rede exclusiva de
            creators.
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="influencerName"
              >
                Nome Completo
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="influencerName"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Digite o seu nome completo"
                maxLength={50}
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="influencerEmail"
              >
                E-mail de Contato
                <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="influencerEmail"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                onBlur={() =>
                  setFormData((prevData) => ({
                    ...prevData,
                    email: prevData.email.toLowerCase(),
                  }))
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Informe o e-mail de contato"
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="influencerPhone"
              >
                Número de Celular/Whatsapp
              </label>
              <input
                type="tel"
                id="influencerPhone"
                value={formData.phone}
                onChange={handlePhoneChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="(XX) XXXXX-XXXX"
                maxLength={15}
              />
            </div>

            <div className="relative">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="creatorPassword"
              >
                Senha <span className="text-red-500">*</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="creatorPassword"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="mt-1 block w-full pr-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Digite sua senha"
                required
              />
              <button
                type="button"
                className="absolute right-2 top-8 text-gray-500" // Ajuste a posição conforme necessário
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {/* Campo de Confirmar Senha */}
            <div className="relative">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="creatorConfirmPassword"
              >
                Confirme a Senha <span className="text-red-500">*</span>
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="creatorConfirmPassword"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="mt-1 block w-full pr-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Confirme sua senha"
                required
              />
              <button
                type="button"
                className="absolute right-2 top-8 text-gray-500" // Ajuste a posição conforme necessário
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={
                  showConfirmPassword ? "Ocultar senha" : "Mostrar senha"
                }
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="influencerTerms"
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
                className="h-4 w-4 text-customLinkBlue border-gray-300 rounded focus:ring-blue-500"
                required
              />
              <label
                htmlFor="influencerTerms"
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

            {(mutation.isError || errorMessage) && (
              <p className="text-red-500" style={{ fontSize: "0.92rem" }}>
                {errorMessage}
              </p>
            )}

            <Button
              variant="orange"
              size="lg"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Enviando..." : "Cadastro Creators"}
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
                É uma marca? Acesse o{" "}
                <a
                  className="text-customLinkBlue underline cursor-pointer"
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
  );
}

export default Page;
