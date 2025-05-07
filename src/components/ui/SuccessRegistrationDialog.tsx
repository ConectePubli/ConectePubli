import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import Modal from "./Modal";
import { Button } from "./button";
import { ArrowLeft } from "lucide-react";
interface SuccessRegistrationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  redirectPath: string;
}

export default function SuccessRegistrationDialog({
  isOpen,
  onClose,
  redirectPath,
}: SuccessRegistrationDialogProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <Modal onClose={onClose}>
      <div className="p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800">
          {t("🎉 Cadastro realizado com sucesso!")}
        </h2>

        <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
          {t(
            "Agora só falta um passo para começar a criar campanhas e se conectar com creators incríveis:"
          )}
        </p>

        <p className="text-sm sm:text-base text-gray-700 font-semibold">
          {t("Complete seu perfil com as informações básicas da sua marca.")}
        </p>

        <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 font-semibold">
          {t(
            "(É rápido e garante mais segurança e credibilidade para atrair os creators certos!)"
          )}
        </p>
        <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
          {t(
            "Assim que seu perfil estiver completo, você poderá publicar sua primeira campanha e começar a receber candidaturas."
          )}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between">
          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("Completar Depois")}
          </Button>
          <Button
            variant="blue"
            onClick={() => {
              navigate({ to: redirectPath });
              onClose();
            }}
            className="w-full sm:w-auto font-semibold"
          >
            {t("Completar Perfil Agora")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
