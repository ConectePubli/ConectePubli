/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link, redirect } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";

import logo from "@/assets/logo.svg";
import loginImage from "@/assets/login.svg";

import pb from "@/lib/pb";
import { getUserType } from "@/lib/auth";

interface PreRegister {
  id: string;
  name: string;
  email: string;
  cell_phone: string;
  responsible_name?: string;
}

interface BaseBody {
  email: string;
  name?: string;
  cell_phone?: string;
  password: string;
  passwordConfirm: string;
}

interface BrandBody extends BaseBody {
  responsible_name: string;
}

export const Route = createFileRoute("/(auth)/login123new/")({
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
        to: "/dashboard-influenciador",
      });
    }
  },
});

function Page() {
  const navigate = useNavigate();

  // States for form data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Visibility and logic controls
  const [showPassword, setShowPassword] = useState(false);
  const [isPreRegistered, setIsPreRegistered] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loginType, setLoginType] = useState<"brand" | "influencer">("brand");

  // Pre registration
  const [dataPreRegister, setDataPreRegister] = useState<PreRegister>({
    id: "",
    name: "",
    email: "",
    cell_phone: "",
    responsible_name: "",
  });

  // Mutation for handling login and registration logic
  const mutation = useMutation({
    mutationFn: async () => {
      const collection = loginType === "brand" ? "Brands" : "Influencers";
      if (isPreRegistered) {
        if (password !== confirmPassword) {
          throw new Error("As senhas não coincidem.");
        }
        if (password.length < 8) {
          throw new Error("A senha deve ter pelo menos 8 caracteres.");
        }

        console.log(dataPreRegister);

        const body: BaseBody | BrandBody = {
          email,
          password,
          passwordConfirm: confirmPassword,
        };

        if (dataPreRegister.name) {
          body.name = dataPreRegister.name;
        }

        if (dataPreRegister.cell_phone) {
          body.cell_phone = dataPreRegister.cell_phone;
        }

        if (collection === "Brands") {
          (body as BrandBody).responsible_name =
            dataPreRegister.responsible_name!;
        }

        await pb.collection(collection).create(body);
        await pb.collection(collection).authWithPassword(email, password);
        const preRegCollection =
          loginType === "brand"
            ? "Brands_Pre_Registration"
            : "Influencers_Pre_Registration";
        await pb.collection(preRegCollection).delete(dataPreRegister.id);
      } else {
        await pb.collection(collection).authWithPassword(email, password);
      }
    },
    onSuccess: () => {
      navigate({ to: "/dashboard" });
    },
    onError: (error: any) => {
      if (error.message === "Failed to authenticate.") {
        setErrorMessage("Email e/ou senha incorretos.");
      } else {
        setErrorMessage(error.message || "Ocorreu um erro ao fazer login.");
      }
    },
  });

  const checkPreRegistration = async () => {
    if (email) {
      try {
        const collection =
          loginType === "brand"
            ? "Brands_Pre_Registration"
            : "Influencers_Pre_Registration";
        const preRegistration = await pb
          .collection(collection)
          .getFirstListItem(`email="${email}"`);
        if (preRegistration) {
          setIsPreRegistered(true);
        } else {
          setIsPreRegistered(false);
        }

        setDataPreRegister(preRegistration as unknown as PreRegister);
      } catch (e) {
        console.log(`error check pre-register: ${e}`);
        setIsPreRegistered(false);
      }
    }
  };

  // Call checkPreRegistration when the user focuses on the password field
  const handlePasswordFocus = () => {
    checkPreRegistration();
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    mutation.mutate();
  };

  return (
    <div className="grid lg:grid-cols-2 overflow-hidden items-center min-h-screen">
      <div
        className="hidden lg:block w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${loginImage})` }}
      ></div>

      <div className="w-full flex flex-col items-center overflow-y-auto px-4 py-6 lg:p-12 mx-auto max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2x">
        <div className="w-full">
          <Link to="/" className="mb-8 block w-fit">
            <img src={logo} alt="ConectePubli" className="h-7" />
          </Link>

          <h2 className="text-3xl font-bold mb-4">Bem-vindo de volta!</h2>
          <p className="text-gray-600 mb-6">
            Conecte-se à sua conta e continue construindo parcerias estratégicas
            com marcas e influenciadores.
          </p>

          <div className="mb-6">
            <div className="flex">
              <button
                className={`px-4 py-2 text-sm font-semibold ${
                  loginType === "brand"
                    ? "border-b-2 border-blue-600 text-customLinkBlue"
                    : "text-gray-600"
                }`}
                onClick={() => setLoginType("brand")}
              >
                Marca
              </button>
              <button
                className={`px-4 py-2 text-sm font-semibold ml-4 ${
                  loginType === "influencer"
                    ? "border-b-2 border-blue-600 text-customLinkBlue"
                    : "text-gray-600"
                }`}
                onClick={() => setLoginType("influencer")}
              >
                Influenciador
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Lembrete: Certifique-se de selecionar a opção correta (
              <strong>Marca</strong> ou <strong>Influenciador</strong>). Se você
              se pré-cadastrou como <strong>Marca</strong>, precisa selecionar
              essa opção para acessar sua conta; o mesmo vale para{" "}
              <strong>Influenciadores</strong>.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="email"
              >
                E-mail
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Informe o e-mail"
              />

              {/* Helper Text for Pre-registered Users */}
              <p className="text-sm text-gray-500 mt-2">
                Para usuários pré-cadastrados: Ao inserir seu e-mail, será
                necessário criar uma senha nesta etapa. Caso já tenha completado
                este processo, entre com a senha existente.
              </p>
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="senha"
              >
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="senha"
                  value={password}
                  onFocus={handlePasswordFocus}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Informe a senha"
                />
                <span
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </span>
              </div>
            </div>

            {isPreRegistered && (
              <div>
                <label
                  className="block text-sm font-medium text-gray-700"
                  htmlFor="confirm-senha"
                >
                  Confirmar Senha
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirm-senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Confirme a senha"
                  />
                </div>
              </div>
            )}

            {errorMessage && <p className="text-red-500">{errorMessage}</p>}

            <div className="text-right">
              <a
                className="text-customLinkBlue underline text-sm cursor-pointer"
                onClick={() => navigate({ to: "/esquecer-senha" })}
              >
                Esqueci minha senha
              </a>
            </div>

            <Button
              variant="blue"
              size="lg"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending
                ? isPreRegistered
                  ? "Cadastrando..."
                  : "Entrando..."
                : isPreRegistered
                  ? "Cadastrar"
                  : "Entrar"}
            </Button>

            <div className="text-center">
              <p className="text-sm">
                Novo por aqui?{" "}
                <a
                  className="text-customLinkBlue underline cursor-pointer"
                  onClick={() => navigate({ to: "/cadastro" })}
                >
                  Crie sua conta gratuitamente!
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
