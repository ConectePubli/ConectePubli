import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import pb from "@/lib/pb";

import passwordResetImage from "@/assets/password-reset.svg";
import { validateEmail } from "@/utils/validateEmail";
import { CheckCircle } from "lucide-react";

export const Route = createFileRoute("/(auth)/esquecer-senha/")({
  component: Page,
});

function Page() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState<"brands" | "influencers">(
    "influencers"
  );
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const mutation = useMutation({
    mutationFn: async () => {
      const collection = userType === "brands" ? "Brands" : "Influencers";
      await pb.collection(collection).requestPasswordReset(email);
    },
    onSuccess: () => {
      setSuccessMessage(true);
      setErrorMessage("");
    },
    onError: (error) => {
      console.error("Erro ao enviar link de redefinição de senha:", error);
      setErrorMessage("Nenhuma conta foi encontrada vinculada a este e-mail.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      return setErrorMessage("Por favor, insira um e-mail válido");
    }

    mutation.mutate();
  };

  return (
    <div className="h-[calc(100vh-66px)] flex lg:flex-row flex-col overflow-hidden">
      <div className="hidden xl:block xl:w-[40%] overflow-hidden">
        <img
          src={passwordResetImage}
          alt="Redefinir Senha"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="w-full xl:w-[60%] flex flex-col items-center bg-white py-8 px-12 lg:py-7 overflow-y-auto max-sm:px-5">
        <div className="w-full max-w-lg">
          <div className="flex justify-center mb-6">
            <button
              className={`px-4 py-2 font-semibold ${userType === "influencers" ? "border-b-2 border-blue-500" : "text-gray-500"}`}
              onClick={() => setUserType("influencers")}
            >
              Creator
            </button>
            <button
              className={`px-4 py-2 font-semibold ml-4 ${userType === "brands" ? "border-b-2 border-blue-500" : "text-gray-500"}`}
              onClick={() => setUserType("brands")}
            >
              Marca
            </button>
          </div>

          {successMessage ? (
            <div>
              <CheckCircle color="#008000" size={40} className="mb-2" />

              <h2 className="text-2xl font-bold flex items-center gap-2">
                E-mail de recuperação enviado!
              </h2>
              <p className="text-gray-600 my-4">
                Se esse e-mail tiver cadastro na plataforma, enviaremos um link
                para redefinição de senha.
              </p>
              <p className="text-gray-600 mb-4">
                Clique no link enviado para o e-mail <strong>{email}</strong>.
              </p>
              <p className="text-red-500 font-semibold mb-6">
                Atenção: Caso não receba o e-mail, verifique sua caixa de spam ou lixeira.
              </p>
              <a
                className="underline text-customLinkBlue text-sm cursor-pointer"
                onClick={() => navigate({ to: "/login" })}
              >
                Voltar para a página de login
              </a>
            </div>
          ) : (
            <div>
              <h2 className="text-3xl font-bold mb-4">Redefinir Senha</h2>
              <p className="text-gray-600 mb-6">
                Digite o e-mail associado à sua conta de{" "}
                {userType === "influencers" ? "creator" : "marca"} e
                enviaremos um link para redefinir sua senha.
              </p>

              <form className="space-y-6" onSubmit={handleSubmit}>
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
                    placeholder="Digite o e-mail da conta"
                    required
                  />
                </div>

                {errorMessage && !mutation.isPending && (
                  <p className="text-red-500 text-sm">{errorMessage}</p>
                )}

                <Button
                  variant="blue"
                  size="lg"
                  className="w-full"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending
                    ? "Enviando..."
                    : "Enviar Link de Recuperação"}
                </Button>

                <div className="text-left">
                  <a
                    className="text-customLinkBlue underline text-sm cursor-pointer"
                    onClick={() => navigate({ to: "/login" })}
                  >
                    Voltar para a página de login
                  </a>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
