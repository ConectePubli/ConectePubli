import { AlignJustify, Bell, MessageCircle } from "lucide-react";
import logo from "@/assets/logo.svg";
import { useSheetStore } from "@/store/useDashSheetStore";
import { UserMenu } from "./UserMenu";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useEffect } from "react";
import { useNotificationStore } from "@/store/useNotificationStore";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Notification } from "@/types/Notification";
import { useNavigate } from "@tanstack/react-router";
import { useMessageStore } from "@/store/useMessageStore";
import { getUserType } from "@/lib/auth";

export const PrivateHeader = () => {
  const { openSheet } = useSheetStore();
  const navigate = useNavigate();

  const { notifications, unreadCount, fetchNotifications, markAsRead } =
    useNotificationStore();
  const { unreadConversationsCount, fetchUnreadConversationsCount } =
    useMessageStore();
  // Verifica se a rota é a página inicial
  const isLandingPage = window?.location.pathname === "/";

  useEffect(() => {
    async function fetchUserTypeAndConversations() {
      const type = await getUserType();
      if (type) {
        fetchUnreadConversationsCount(type);
      }
    }
    fetchUserTypeAndConversations();
  }, [fetchUnreadConversationsCount]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleNotificationClick = (notification: Notification) => {
    console.log("Clicou na notificação", notification);

    if (notification.type === "new_campaign") {
      if (!notification.read) {
        markAsRead(notification.id);
      }
      navigate({
        to: `/dashboard/campanhas/${notification.expand?.campaign.unique_name}`,
      });
    }
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
            <button
              className="focus:outline-none relative"
              aria-label={`Você tem ${unreadConversationsCount} conversas não lidas`}
              onClick={() => navigate({ to: "/chat" })}
            >
              <MessageCircle className="w-5 h-5 md:w-6 md:h-6 cursor-pointer hover:text-gray-600 transition duration-200" />
              {unreadConversationsCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 rounded-full bg-[#FF672F] text-white text-xs">
                  {unreadConversationsCount}
                </span>
              )}
            </button>
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
              <PopoverContent className="w-80 md:w-96 p-0 mr-16">
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
                      } ${
                        notification.type !== "new_campaign" &&
                        "hover:cursor-default"
                      } hover:bg-accent ${
                        index !== notifications.length - 1
                          ? "border-b border-gray-200"
                          : ""
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <p className="text-sm">{notification.description}</p>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(notification.created!), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    </li>
                  ))}
                </ul>
                {/* <Button UTILIZAR QUANDO FOR FAZER UMA PÁGINA ESPECIFICA PRA ISSO
                  variant="outline"
                  className="rounded-t-none w-full text-[#10438F] font-semibold hover:text-[#10438F]"
                  onClick={() => (window.location.href = "/notificacoes")}
                >
                  Ver todas as notificações
                </Button> */}
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
