import { useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useRouter } from "@tanstack/react-router";
import pb from "@/lib/pb";
import { LayoutDashboard } from "lucide-react";
import ProfilePlaceholder from "@/assets/profile-placeholder.webp";
import { t } from "i18next";

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const userName = pb.authStore.model?.username;

  const handleLogout = () => {
    setOpen(false);
    pb.logout();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar>
            <AvatarImage
              src={
                pb.authStore?.model?.profile_img
                  ? `${import.meta.env.VITE_POCKETBASE_URL}/api/files/${pb.authStore?.model?.collectionName}/${pb.authStore?.model?.id}/${pb.authStore?.model?.profile_img}`
                  : ProfilePlaceholder
              }
              alt="Avatar"
              className="cursor-pointer bg-black object-cover"
            />
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="mr-8">
          <p className="px-4 py-2 text-sm text-muted-foreground">
            {t("Olá, {{name}}!", { name: pb.authStore.model?.name })}
          </p>
          <DropdownMenuItem
            onSelect={() => {
              if (userName) {
                router.navigate({
                  to: `/${pb.authStore.model?.collectionName === "Brands" ? "dashboard-marca" : "dashboard-creator"}`,
                });
              }
            }}
            className="hover:bg-black cursor-pointer"
          >
            <LayoutDashboard className="mr-2 inline-block h-5 w-5" />
            Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              if (userName) {
                router.navigate({
                  to: `/${pb.authStore.model?.collectionName === "Brands" ? "marca" : "creator"}/${userName}`,
                });
              }
            }}
            className="hover:bg-black cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              className="mr-2 inline-block h-5 w-5"
            >
              <path
                fill="currentColor"
                d="M12 2.5a5.5 5.5 0 0 1 3.096 10.047a9.005 9.005 0 0 1 5.9 8.181a.75.75 0 1 1-1.499.044a7.5 7.5 0 0 0-14.993 0a.75.75 0 0 1-1.5-.045a9.005 9.005 0 0 1 5.9-8.18A5.5 5.5 0 0 1 12 2.5M8 8a4 4 0 1 0 8 0a4 4 0 0 0-8 0"
              />
            </svg>
            {t("Perfil")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setOpen(true)}
            className="text-black cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              className="mr-2 inline-block h-5 w-5"
            >
              <path
                fill="currentColor"
                d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h7v2H5v14h7v2zm11-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5z"
              />
            </svg>
            {t("Sair")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* AlertDialog */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          {/* Hidden trigger, since we control the dialog with state */}
          <button className="hidden">Show Alert</button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("Confirmar saída")}</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja sair? Esta ação irá encerrar sua sessão.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(false)}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-[#001D7E] hover:bg-[#091DD3]"
            >
              Sair
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
