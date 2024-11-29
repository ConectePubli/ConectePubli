import pb from "@/lib/pb";
import { Chat } from "@/types/Chat";
import { Message } from "@/types/Message";

export async function createOrGetChat(
  campaignId: string,
  influencerId: string,
  brandId: string
): Promise<Chat> {
  try {
    const chats = await pb.collection<Chat>("chats").getList(1, 1, {
      filter: `campaign="${campaignId}" && influencer="${influencerId}" && brand="${brandId}"`,
    });

    if (chats.items.length > 0) {
      return chats.items[0];
    }

    const newChat = await pb.collection<Chat>("chats").create({
      campaign: campaignId,
      influencer: influencerId,
      brand: brandId,
    });

    return newChat;
  } catch (error) {
    console.error("Erro ao criar ou obter o chat:", error);
    throw error;
  }
}

// Busca os chats para o usuário logado
export async function getChatsForUser(
  userType: string | null
): Promise<Chat[]> {
  if (!userType) return [];

  const filter =
    userType === "Brands"
      ? `brand="${pb.authStore.model?.id}"`
      : `influencer="${pb.authStore.model?.id}"`;

  const chats = await pb.collection("chats").getFullList<Chat>({
    filter,
    expand: "campaign,influencer,brand,messages_via_chat",
  });

  const sortedChats = chats.sort((a, b) => {
    const lastMessageA = a.expand?.["messages_via_chat"]?.slice(-1)[0]?.created
      ? new Date(a.expand["messages_via_chat"].slice(-1)[0].created)
      : new Date(0);
    const lastMessageB = b.expand?.["messages_via_chat"]?.slice(-1)[0]?.created
      ? new Date(b.expand["messages_via_chat"].slice(-1)[0].created)
      : new Date(0);

    return lastMessageB.getTime() - lastMessageA.getTime();
  });

  // Ordena os chats pela última mensagem (mais recente primeiro)
  return sortedChats;
}
// Busca um chat específico
export async function getChatDetails(
  campaignId: string,
  influencerId: string,
  brandId: string
): Promise<Chat> {
  return await pb
    .collection("chats")
    .getFirstListItem(
      `campaign="${campaignId}" && influencer="${influencerId}" && brand="${brandId}"`,
      { expand: "campaign,influencer,brand" }
    );
}

// Busca mensagens de um chat
export async function getMessages(chatId: string): Promise<Message[]> {
  return await pb.collection("messages").getFullList({
    filter: `chat="${chatId}"`,
    sort: "created",
  });
}

// Envia uma mensagem
export async function sendMessage(
  chatId: string,
  text: string,
  userType: string | null
): Promise<Message> {
  const senderField =
    userType === "Brands" ? "brand_sender" : "influencer_sender";
  return await pb.collection("messages").create({
    chat: chatId,
    text,
    [senderField]: pb.authStore.model?.id,
  });
}
