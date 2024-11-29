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

export async function getUnreadConversationsCount(
  userType: string
): Promise<number> {
  const currentUserId = pb.authStore.model?.id;
  if (!currentUserId) return 0;

  const collection = pb.collection("messages");

  let filter = "";

  if (userType === "Brands") {
    filter = `read = false && influencer_sender != null && chat.brand = "${currentUserId}"`;
  } else if (userType === "Influencers") {
    filter = `read = false && brand_sender != null && chat.influencer = "${currentUserId}"`;
  }

  const messages = await collection.getFullList<Message>({
    filter,
    expand: "chat",
  });

  // Filtrar mensagens onde o chat é pertencente ao usuário atual
  const messagesForCurrentUser = messages.filter((message) => {
    const chat = message.expand?.chat;
    if (!chat) return false;

    if (userType === "Brands") {
      return chat.brand === currentUserId;
    } else if (userType === "Influencers") {
      return chat.influencer === currentUserId;
    }
    return false;
  });

  const uniqueChats = new Set(
    messagesForCurrentUser.map((message) => message.chat)
  );
  return uniqueChats.size;
}

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

  return sortedChats;
}

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

export async function getMessages(chatId: string): Promise<Message[]> {
  return await pb.collection("messages").getFullList({
    filter: `chat="${chatId}"`,
    sort: "created",
  });
}

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

export async function markMessagesAsRead(
  chatId: string,
  userType: string | null
): Promise<void> {
  if (!userType || !pb.authStore.model?.id) return;

  const oppositeSenderField =
    userType === "Brands" ? "influencer_sender" : "brand_sender";

  try {
    // Busca mensagens não lidas enviadas pelo outro usuário
    const unreadMessages = await pb
      .collection("messages")
      .getFullList<Message>({
        filter: `chat="${chatId}" && ${oppositeSenderField} != null && read = false`,
      });

    console.log("Mensagens não lidas:", unreadMessages);

    // Atualiza cada mensagem para marcar como lida
    for (const message of unreadMessages) {
      await pb.collection("messages").update(message.id, { read: true });
      console.log(`Mensagem ${message.id} marcada como lida.`);
    }
  } catch (error) {
    console.error("Erro ao marcar mensagens como lidas:", error);
  }
}
