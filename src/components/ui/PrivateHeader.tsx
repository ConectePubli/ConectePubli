import { AlignJustify, Bell } from "lucide-react";
import logo from "@/assets/logo.svg";
import { useSheetStore } from "@/store/useDashSheetStore";
import { UserMenu } from "./UserMenu";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const PrivateHeader = () => {
  const { openSheet } = useSheetStore();

  const mockNotifications = [
    {
      id: "1",
      message: "Você recebeu uma nova mensagem.",
      time: "Há 2 horas",
      read: false,
    },
    {
      id: "2",
      message: "Sua publicação foi aprovada.",
      time: "Há 4 horas",
      read: true,
    },
    {
      id: "3",
      message: "Novo comentário na sua postagem.",
      time: "Há 1 dia",
      read: false,
    },
    {
      id: "4",
      message: "Atualização disponível.",
      time: "Há 3 dias",
      read: true,
    },
    {
      id: "5",
      message: "Você tem um novo seguidor.",
      time: "Há 5 dias",
      read: false,
    },
  ];

  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Verifica se a rota é a página inicial
  const isLandingPage = window?.location.pathname === "/";

  const handleNotificationClick = (id: string) => {
    // Atualizar o estado localmente
    setNotifications((prevNotifications) =>
      prevNotifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

    // TODO: Enviar atualização para o backend (PocketBase)
    // Exemplo:
    // fetch(`/api/notifications/${id}/mark-as-read`, { method: 'POST' });
  };

  return (
    <header className="bg-white border-b-[1px] sticky top-0 z-[1]">
      <div
        className={`h-[65px] flex items-center px-4 ${
          isLandingPage
            ? "mx-auto max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl"
            : ""
        }`}
      >
        <div className="pr-2 md:p-4 md:hidden flex items-center justify-start">
          <button className="focus:outline-none pr-2" onClick={openSheet}>
            <AlignJustify size={25} />
          </button>
        </div>

        <div className="flex items-center justify-end w-full">
          {/* Logo (aparece após 340px de width)*/}
          <div className="hidden min-[340px]:block flex-grow">
            <img
              src={logo}
              alt="Conecte Publi"
              className="h-8 md:h-10 cursor-pointer"
              onClick={() => window.location.replace("/")}
              draggable={false}
            />
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="focus:outline-none relative"
                  aria-label={`Você tem ${unreadCount} notificações não lidas`}
                >
                  <Bell className="w-5 h-5 md:w-6 md:h-6 cursor-pointer hover:text-gray-600 transition duration-200" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 rounded-full bg-[#FF672F] text-white text-xs">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 md:w-96 p-0">
                <div className="bg-[#10438F] rounded-t-md pl-3">
                  <h3 className="text-base font-semibold py-2 text-white">
                    Notificações
                  </h3>
                </div>
                <ul className="space-y-0 max-h-60 overflow-y-auto">
                  {notifications.map((notification, index) => (
                    <li
                      key={notification.id}
                      className={`px-4 py-2 hover:cursor-pointer ${
                        notification.read ? "bg-white" : "bg-blue-50"
                      } hover:bg-accent ${
                        index !== notifications.length - 1
                          ? "border-b border-gray-200"
                          : ""
                      }`}
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <p className="text-sm">{notification.message}</p>
                      <span className="text-xs text-gray-500">
                        {notification.time}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant="outline"
                  className="rounded-t-none w-full text-[#10438F] font-semibold hover:text-[#10438F]"
                  onClick={() => (window.location.href = "/notificacoes")}
                >
                  Ver todas as notificações
                </Button>
              </PopoverContent>
            </Popover>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border flex items-center justify-center">
              <UserMenu />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
