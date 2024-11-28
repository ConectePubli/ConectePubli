import { useSearch, createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  getChatsForUser,
  getChatDetails,
  getMessages,
  sendMessage,
} from "@/services/chatService";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUserType } from "@/lib/auth";
import { Chat } from "@/types/Chat";
import { Message } from "@/types/Message";
import { Loader2 } from "lucide-react"; // Importação do ícone de loading

export const Route = createFileRoute("/chat/")({
  component: ChatPage,
});

function ChatPage() {
  const router = useRouter();
  const { campaignId, influencerId, brandId } = useSearch({
    from: "/chat/",
  });
  const [userType, setUserType] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false); // Estado de loading para envio de mensagens

  // Buscar o tipo de usuário ao montar o componente
  useEffect(() => {
    async function fetchUserType() {
      try {
        const type = await getUserType();
        setUserType(type);
      } catch (error) {
        console.error("Erro ao obter o tipo de usuário:", error);
      }
    }
    fetchUserType();
  }, []);

  // Buscar as conversas do usuário quando o tipo de usuário for definido
  useEffect(() => {
    if (userType) {
      async function fetchChats() {
        setLoadingChats(true);
        try {
          const fetchedChats = await getChatsForUser(userType);
          console.log("AAAAAAAA,", fetchedChats);
          setChats(fetchedChats);
        } catch (error) {
          console.error("Erro ao obter chats:", error);
        } finally {
          setLoadingChats(false);
        }
      }
      fetchChats();
    }
  }, [userType]);

  // Atualizar o chat selecionado e buscar mensagens quando os parâmetros de busca mudarem
  useEffect(() => {
    if (campaignId && influencerId && brandId) {
      // Encontrar o chat na lista de chats existente
      const chat = chats.find(
        (c) =>
          c.campaign === campaignId &&
          c.influencer === influencerId &&
          c.brand === brandId
      );

      if (chat) {
        setSelectedChat(chat); // Atualiza imediatamente o chat selecionado
      }

      // Buscar detalhes completos do chat e mensagens
      async function fetchChat() {
        setLoadingMessages(true);
        try {
          const chatDetails = await getChatDetails(
            campaignId,
            influencerId,
            brandId
          );
          setSelectedChat(chatDetails); // Atualiza com os detalhes completos do chat

          const fetchedMessages = await getMessages(chatDetails.id);
          setMessages(fetchedMessages);
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
  }, [campaignId, influencerId, brandId, chats]);

  // Função para enviar uma mensagem
  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedChat) {
      setSendingMessage(true); // Inicia o loading
      try {
        const sentMessage = await sendMessage(
          selectedChat.id,
          newMessage,
          userType
        );
        setMessages((prev) => [...prev, sentMessage]);
        setNewMessage("");
        // Opcional: Fazer scroll para a última mensagem
        // scrollToBottom();
      } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
        alert("Falha ao enviar a mensagem. Por favor, tente novamente.");
      } finally {
        setSendingMessage(false); // Encerra o loading
      }
    }
  };

  // Função para selecionar um chat
  const handleSelectChat = (
    campaignId: string,
    influencerId: string,
    brandId: string
  ) => {
    // Encontrar o chat na lista de chats existente
    const chat = chats.find(
      (c) =>
        c.campaign === campaignId &&
        c.influencer === influencerId &&
        c.brand === brandId
    );

    if (chat) {
      setSelectedChat(chat); // Atualiza imediatamente o chat selecionado
    }

    // Atualiza os parâmetros de busca na URL
    router.navigate({
      search: {
        // @ts-expect-error - Não é possível tipar undefined para o search
        campaignId,
        influencerId,
        brandId,
      },
    });
  };

  // Função para fechar o chat
  const handleCloseChat = () => {
    setSelectedChat(null); // Redefine o chat selecionado
    router.navigate({
      search: {
        // @ts-expect-error - Não é possível tipar undefined para o search
        campaignId: undefined,
        influencerId: undefined,
        brandId: undefined,
      },
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-66px)] bg-gray-100 items-center md:pt-4">
      <div className="flex w-full md:w-[90%] lg:w-[80%] xl:w-[70%] h-full md:h-[70vh] gap-3">
        {/* Lista de Conversas */}
        <aside
          className={`${
            selectedChat
              ? "hidden md:flex md:w-[30%]"
              : "flex w-full md:w-[30%]"
          } bg-white border-r p-4 md:rounded-xl shadow-md`}
        >
          <div className="w-full h-full flex flex-col">
            <h1 className="text-xl font-bold mb-4">Conversas</h1>
            <div className="flex-1 overflow-y-auto space-y-4">
              {loadingChats ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
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
                    : "Sem mensagens";

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
                      <Avatar>
                        <AvatarImage
                          src={
                            userType === "Brands"
                              ? chat.expand?.influencer?.profile_img
                              : chat.expand?.brand?.profile_img
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
                          {chat.expand?.campaign?.name ||
                            "Sem nome de campanha"}
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
              ? "flex w-full md:w-[70%] lg:w-[70%] h-full md:h-[70vh]"
              : "hidden md:flex md:w-[70%] lg:w-[70%] h-full md:h-[70vh]"
          } flex-col bg-white rounded-xl shadow-md`}
        >
          {selectedChat ? (
            <>
              {/* Header do Chat */}
              <header className="border-b p-4 flex items-center gap-2">
                {/* Botão de Voltar no Mobile */}
                <button
                  className="block md:hidden text-gray-500 hover:text-gray-800"
                  onClick={handleCloseChat}
                >
                  Voltar
                </button>
                <Avatar>
                  <AvatarImage
                    src={
                      userType === "Brands"
                        ? selectedChat.expand?.influencer?.profile_img
                        : selectedChat.expand?.brand?.profile_img
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
              </header>

              {/* Mensagens e Input */}
              <div className="flex flex-col flex-1">
                {/* Mensagens */}
                <div className="flex-1 overflow-y-auto p-4">
                  {loadingMessages ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
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
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200"
                          }`}
                        >
                          <p>{message.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Input de Mensagem */}
                <footer className="border-t p-4 flex items-center gap-2">
                  <Input
                    placeholder="Digite uma mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                    type="text"
                    disabled={sendingMessage} // Desabilita o input durante o envio
                  />
                  <Button
                    onClick={handleSendMessage}
                    className="bg-blue-500 text-white flex items-center justify-center"
                    disabled={sendingMessage} // Desabilita o botão durante o envio
                  >
                    {sendingMessage ? (
                      <Loader2 className="animate-spin h-5 w-5" />
                    ) : (
                      "Enviar"
                    )}
                  </Button>
                </footer>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Selecione uma conversa</p>
            </div>
          )}
        </main>
      </div>

      {/* Parágrafo Informativo Centralizado na Parte Inferior */}
      <div className="flex flex-col w-[65%]  items-center pt-4">
        <p className="text-center text-gray-500 text-[12px] font-semibold">
          A fim de garantir a segurança e transparência na nossa plataforma,
          lembramos a todos os usuários que todo o contato e comunicação entre
          marcas e influencers deve ser realizado exclusivamente através do
          nosso chat interno. Qualquer tentativa de comunicação fora do chat
          poderá resultar no banimento permanente da plataforma. Agradecemos a
          compreensão e colaboração de todos!
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
            Termos de Uso
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
            Política de Privacidade
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
