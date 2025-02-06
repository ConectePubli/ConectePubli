// src/components/ui/DuplicatedCampaignAlertDialog.tsx
import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { TriangleAlert } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DuplicatedCampaignAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaignName: string;
}

const DuplicatedCampaignAlertDialog: React.FC<
  DuplicatedCampaignAlertDialogProps
> = ({ open, onOpenChange, campaignName }) => {
  const { t } = useTranslation();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-full max-w-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <TriangleAlert className="text-yellow-400 flex-0" />{" "}
            {t("Atenção: Revise as datas da sua campanha duplicada")}
          </AlertDialogTitle>
          <AlertDialogDescription
            className="flex flex-col gap-2 font-semibold text-gray-700"
            asChild
          >
            <div>
              <span>
                {t("Você acabou de duplicar a campanha")}{" "}
                <strong>{campaignName}</strong> {t("com sucesso! 🎉")}
              </span>

              <span>
                {t(
                  "Para evitar problemas no planejamento, revise com atenção as datas de inscrições e da campanha. Por padrão, as mesmas datas da campanha original foram mantidas."
                )}
              </span>

              <span>
                <span>{t("O que revisar:")}</span>
                <ul className="list-disc pl-5">
                  <li>{t("Datas de inscrição")}</li>
                  <li>{t("Data de início e fim da campanha")}</li>
                  <li>{t("Valor da remuneração do criador")}</li>
                </ul>
              </span>

              <span>
                {t(
                  "Altere as datas, se necessário, para garantir que tudo esteja alinhado com seus objetivos."
                )}
              </span>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            {t("Fechar")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => onOpenChange(false)}>
            {t("Ok")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DuplicatedCampaignAlertDialog;
