import { useSearch, createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  getChatsForUser,
  getChatDetails,
  getMessages,
  sendMessage,
  markMessagesAsRead,
} from "@/services/chatService";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chat } from "@/types/Chat";
import { Message } from "@/types/Message";
import { Loader2, Undo2, X } from "lucide-react";
import pb from "@/lib/pb";
import { useMessageStore } from "@/store/useMessageStore";
import { linkify } from "@/utils/linkify";
import { t } from "i18next";

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/dashboard/chat/"
)({
  component: ChatPage,
});

function ChatPage() {
  const router = useRouter();
  const { campaignId, influencerId, brandId } = useSearch({
    from: "/(dashboard)/_side-nav-dashboard/dashboard/chat/",
  });
  const { decrementUnreadConversationsCount } = useMessageStore();

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const messagesRef = useRef<HTMLDivElement | null>(null);

  const [userType, setUserType] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [unreadChatIds, setUnreadChatIds] = useState<Set<string>>(new Set());

  const scrollToEndBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (messagesContainerRef.current && messagesRef.current) {
      scrollToEndBottom();
    } else {
      const timer = setTimeout(() => {
        scrollToEndBottom();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [messages, loadingChats]);

  useEffect(() => {
    async function fetchUserType() {
      try {
        const type = pb.authStore.model?.collectionName || null;
        setUserType(type);
      } catch (error) {
        console.error("Erro ao obter o tipo de usuário:", error);
      }
    }
    fetchUserType();
  }, []);

  useEffect(() => {
    if (userType) {
      async function fetchChats() {
        setLoadingChats(true);
        try {
          const fetchedChats = await getChatsForUser(userType);
          setChats(fetchedChats);

          const initialUnreadChatIds = new Set<string>();
          fetchedChats.forEach((chat) => {
            const hasUnreadMessages = chat.expand?.messages_via_chat?.some(
              (message) => {
                const isUnread = !message.read;
                const isFromOtherUser =
                  (userType === "Brands" && message.influencer_sender) ||
                  (userType === "Influencers" && message.brand_sender);
                return isUnread && isFromOtherUser;
              }
            );

            if (hasUnreadMessages) {
              initialUnreadChatIds.add(chat.id);
            }
          });
          setUnreadChatIds(initialUnreadChatIds);
        } catch (error) {
          console.error("Erro ao obter chats:", error);
        } finally {
          setLoadingChats(false);
        }
      }
      fetchChats();
    }
  }, [userType]);

  useEffect(() => {
    if (campaignId && influencerId && brandId) {
      const chat = chats.find(
        (c) =>
          c.campaign === campaignId &&
          c.influencer === influencerId &&
          c.brand === brandId
      );

      if (chat) {
        setSelectedChat(chat);
      }

      async function fetchChat() {
        setLoadingMessages(true);
        try {
          const chatDetails = await getChatDetails(
            campaignId,
            influencerId,
            brandId
          );
          setSelectedChat(chatDetails);

          const fetchedMessages = await getMessages(chatDetails.id);
          setMessages(fetchedMessages);

          const hadUnreadMessages = fetchedMessages.some(
            (message) =>
              message.read === false &&
              ((userType === "Brands" && message.influencer_sender) ||
                (userType === "Influencers" && message.brand_sender))
          );

          await markMessagesAsRead(chatDetails.id, userType);

          if (hadUnreadMessages) {
            decrementUnreadConversationsCount();
          }
        } catch (error) {
          console.error("Erro ao obter detalhes do chat ou mensagens:", error);
        } finally {
          setLoadingMessages(false);
        }
      }
      fetchChat();
    } else if (influencerId && brandId && !campaignId) {
      const chat = chats.find(
        (c) =>
          c.campaign === "" &&
          c.influencer === influencerId &&
          c.brand === brandId
      );

      if (chat) {
        setSelectedChat(chat);
      }

      async function fetchChat() {
        setLoadingMessages(true);
        try {
          const chatDetails = await getChatDetails("", influencerId, brandId);
          setSelectedChat(chatDetails);

          const fetchedMessages = await getMessages(chatDetails.id);
          setMessages(fetchedMessages);

          const hadUnreadMessages = fetchedMessages.some(
            (message) =>
              message.read === false &&
              ((userType === "Brands" && message.influencer_sender) ||
                (userType === "Influencers" && message.brand_sender))
          );

          await markMessagesAsRead(chatDetails.id, userType);

          if (hadUnreadMessages) {
            decrementUnreadConversationsCount();
          }
        } catch (error) {
          console.error("Erro ao obter detalhes do chat ou mensagens:", error);
        } finally {
          setLoadingMessages(false);
        }
      }
      fetchChat();
    } else {
      setSelectedChat(null);
      setMessages([]);
    }
  }, [
    campaignId,
    influencerId,
    brandId,
    chats,
    userType,
    decrementUnreadConversationsCount,
  ]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedChat) {
      setSendingMessage(true);
      try {
        const sentMessage = await sendMessage(
          selectedChat.id,
          newMessage,
          userType
        );
        setMessages((prev) => [...prev, sentMessage]);
        setNewMessage("");
        scrollToBottom();
      } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
        alert(t("Falha ao enviar a mensagem. Por favor, tente novamente."));
      } finally {
        setSendingMessage(false);
      }
    }
  };

  const handleSelectChat = (
    campaignId: string,
    influencerId: string,
    brandId: string
  ) => {
    const chat = chats.find(
      (c) =>
        c.campaign === campaignId &&
        c.influencer === influencerId &&
        c.brand === brandId
    );

    if (chat) {
      setSelectedChat(chat);
      setUnreadChatIds((prevUnreadChatIds) => {
        const newUnreadChatIds = new Set(prevUnreadChatIds);
        newUnreadChatIds.delete(chat.id);
        return newUnreadChatIds;
      });
    }

    router.navigate({
      search: {
        // @ts-expect-error - Não é possível tipar undefined para o search
        campaignId,
        influencerId,
        brandId,
      },
    });
  };

  const handleCloseChat = () => {
    setSelectedChat(null);
    router.navigate({
      search: {
        // @ts-expect-error - Não é possível tipar undefined para o search
        campaignId: undefined,
        influencerId: undefined,
        brandId: undefined,
      },
    });
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.history.back();
    } else {
      const defaultRoute = `/${pb.authStore.model?.collectionName === "Brands" ? "dashboard-marca" : "dashboard-creator"}`;
      router.navigate({ to: defaultRoute });
    }
  };
  return (
    <div className="flex flex-col h-[calc(100vh-66px)] bg-gray-100 items-center lg:pt-4">
      <div className="flex w-[90%] max-lg:pt-4 rounded-lg xl:w-[80%] 2xl:w-[70%] h-full lg:h-[70vh] gap-3">
        {/* Lista de Conversas */}
        <aside
          className={`${
            selectedChat
              ? "hidden lg:flex lg:w-[30%]"
              : "flex w-full lg:w-[30%] max-lg:rounded-lg"
          } bg-white border-r p-4 md:rounded-xl shadow-md`}
        >
          <div className="w-full h-full flex flex-col">
            <Button
              className="text-gray-500 text-sm font-semibold flex flex-row gap-2 items-center justify-start w-28"
              variant={"ghost"}
              onClick={handleBack}
            >
              <Undo2 className="h-6 w-6" />
              {t("Voltar")}
            </Button>
            <h1 className="text-xl font-bold mb-4">{t("Conversas")}</h1>
            <div className="flex-1 overflow-y-auto space-y-4">
              {loadingChats ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#10438F]"></div>
                </div>
              ) : (
                chats.map((chat) => {
                  const lastMessage =
                    chat.expand?.["messages_via_chat"]?.slice(-1)[0];
                  const lastMessageDate = lastMessage
                    ? new Date(lastMessage.created).toLocaleDateString(
                        "pt-BR",
                        {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )
                    : t("Sem mensagens");

                  return (
                    <div
                      key={chat.id}
                      className={`cursor-pointer flex items-center gap-2 p-2 ${
                        selectedChat?.id === chat.id
                          ? "bg-gray-200 rounded-md"
                          : ""
                      }`}
                      onClick={() =>
                        handleSelectChat(
                          chat.campaign,
                          chat.influencer,
                          chat.brand
                        )
                      }
                    >
                      {unreadChatIds.has(chat.id) && (
                        <span className="h-4 w-5 rounded-full bg-[#10438F]"></span>
                      )}
                      <Avatar>
                        <AvatarImage
                          src={
                            userType === "Brands"
                              ? `${import.meta.env.VITE_POCKETBASE_URL}/api/files/${chat.expand?.influencer?.collectionName}/${chat.expand?.influencer?.id}/${chat.expand?.influencer?.profile_img}`
                              : `${import.meta.env.VITE_POCKETBASE_URL}/api/files/${chat.expand?.brand?.collectionName}/${chat.expand?.brand?.id}/${chat.expand?.brand?.profile_img}`
                          }
                        />
                        <AvatarFallback>
                          {userType === "Brands"
                            ? chat.expand?.influencer?.name
                              ? chat.expand.influencer.name.charAt(0)
                              : chat.expand?.influencer?.username.charAt(0)
                            : chat.expand?.brand?.name
                              ? chat.expand.brand.name.charAt(0)
                              : chat.expand?.brand?.username.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col w-full">
                        <h2 className="font-semibold">
                          {userType === "Brands"
                            ? chat.expand?.influencer?.name ||
                              chat.expand?.influencer?.username
                            : chat.expand?.brand?.name ||
                              chat.expand?.brand?.username}
                        </h2>
                        <p className="text-sm text-gray-500 truncate w-40">
                          {chat.expand?.campaign?.name || ""}
                        </p>
                        <p className="text-xs text-gray-400">
                          {lastMessageDate}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </aside>

        {/* Área de Chat */}
        <main
          className={`${
            selectedChat
              ? "flex w-full lg:w-[70%] xl:w-[70%] h-full lg:h-[70vh]"
              : "hidden lg:flex lg:w-[70%] xl:w-[70%] h-full lg:h-[70vh]"
          } flex-col bg-white rounded-xl shadow-md`}
        >
          {selectedChat ? (
            <>
              {/* Header do Chat */}
              <header className="border-b p-4 flex items-center gap-2 justify-between">
                <div className="flex flex-row gap-2 items-center">
                  <Avatar>
                    <AvatarImage
                      src={
                        userType === "Brands"
                          ? `${import.meta.env.VITE_POCKETBASE_URL}/api/files/${selectedChat.expand?.influencer?.collectionName}/${selectedChat.expand?.influencer?.id}/${selectedChat.expand?.influencer?.profile_img}`
                          : `${import.meta.env.VITE_POCKETBASE_URL}/api/files/${selectedChat.expand?.brand?.collectionName}/${selectedChat.expand?.brand?.id}/${selectedChat.expand?.brand?.profile_img}`
                      }
                    />
                    <AvatarFallback>
                      {userType === "Brands"
                        ? selectedChat.expand?.influencer?.name?.charAt(0)
                        : selectedChat.expand?.brand?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="font-bold text-xl">
                      {userType === "Brands"
                        ? selectedChat.expand?.influencer?.name
                        : selectedChat.expand?.brand?.name}
                    </h1>
                    <p className="text-sm text-gray-500">
                      {selectedChat.expand?.campaign?.name}
                    </p>
                  </div>
                </div>

                {/* Botão de Voltar no Mobile */}
                <Button
                  className="block  text-gray-500 hover:text-gray-800 font-bold"
                  variant="ghost"
                  onClick={handleCloseChat}
                >
                  <X className="h-6 w-6 outline outline-2 rounded-full" />
                </Button>
              </header>

              {/* Mensagens e Input */}
              <div className="flex flex-col flex-1 overflow-y-auto">
                {/* Mensagens */}
                <div
                  className="flex-1 overflow-y-auto p-4 flex flex-col gap-2"
                  ref={messagesContainerRef}
                >
                  {loadingMessages ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#10438F]"></div>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        ref={messagesRef}
                        key={message.id}
                        className={`flex ${
                          (userType === "Brands" && message.brand_sender) ||
                          (userType === "Influencers" &&
                            message.influencer_sender)
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`rounded-lg p-2 max-w-xs ${
                            (userType === "Brands" && message.brand_sender) ||
                            (userType === "Influencers" &&
                              message.influencer_sender)
                              ? "bg-[#10438F] text-white"
                              : "bg-gray-200"
                          }`}
                        >
                          <p className="break-words whitespace-pre-wrap">
                            {linkify(message.text)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Input de Mensagem */}
                <footer className="border-t p-4 flex items-center gap-2">
                  <Input
                    placeholder={t("Digite uma mensagem...")}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                    type="text"
                    disabled={sendingMessage}
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-[#10438F] hover:bg-[#10438F]/90 text-white flex items-center justify-center font-semibold"
                    disabled={sendingMessage}
                  >
                    {sendingMessage ? (
                      <Loader2 className="animate-spin h-5 w-5" />
                    ) : (
                      t("Enviar")
                    )}
                  </Button>
                </footer>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">{t("Selecione uma conversa")}</p>
            </div>
          )}
        </main>
      </div>

      {/* Parágrafo Informativo Centralizado na Parte Inferior */}
      <div className="flex flex-col w-[65%]  items-center pt-4">
        <p className="text-center text-gray-500 text-[12px] font-semibold">
          {t(
            "A fim de garantir a segurança e transparência na nossa plataforma, lembramos a todos os usuários que todo o contato e comunicação entre marcas e influencers deve ser realizado exclusivamente através do nosso chat interno. Qualquer tentativa de comunicação fora do chat poderá resultar no banimento permanente da plataforma. Agradecemos a compreensão e colaboração de todos!"
          )}
        </p>
        <div className="gap-5 flex">
          <Button
            className="mt-4"
            onClick={() =>
              window.open(
                "/termos",
                "_blank",
                "width=800,height=600,scrollbars=yes,resizable=yes"
              )
            }
            variant={"link"}
          >
            {t("Termos de Uso")}
          </Button>
          <Button
            className="mt-4"
            onClick={() =>
              window.open(
                "/privacidade",
                "_blank",
                "width=800,height=600,scrollbars=yes,resizable=yes"
              )
            }
            variant={"link"}
          >
            {t("Política de Privacidade")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;

function scrollToBottom() {
  const messagesContainer = document.getElementById("messages-container");
  if (messagesContainer) {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}
