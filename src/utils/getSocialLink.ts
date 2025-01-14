export const socialMediaBaseUrls: Record<string, string> = {
  Instagram: "https://instagram.com/",
  YouTube: "https://youtube.com/",
  Tiktok: "https://tiktok.com/@",
  Facebook: "https://facebook.com/",
  LinkedIn: "https://linkedin.com/in/",
  Twitter: "https://twitter.com/",
  Twitch: "https://twitch.tv/",
  Pinterest: "https://pinterest.com/",
  Kwai: "https://kwai.com/@",
  YourClub: "https://yourclub.com/",
};

/**
 * Processa a entrada do usuário para gerar um link válido para a rede social.
 * @param platform - Nome da rede social.
 * @param input - Entrada fornecida pelo usuário (URL completa, URL parcial, username ou @username).
 * @returns URL completa para a rede social ou null se inválido.
 */
export const getSocialLink = (
  platform: string,
  input: string | null | undefined
): string | null => {
  if (!input) return null;

  const baseUrl = socialMediaBaseUrls[platform];
  if (!baseUrl) return null; 
 
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const trimmedInput = input.trim();

  if (isValidUrl(trimmedInput)) {
    return trimmedInput.startsWith("http://") ||
      trimmedInput.startsWith("https://")
      ? trimmedInput
      : `https://${trimmedInput}`;
  }

  const lowerInput = trimmedInput.toLowerCase();
  const platformDomain = new URL(baseUrl).hostname.replace("www.", "");
  if (lowerInput.includes(platformDomain)) {
    const hasProtocol =
      trimmedInput.startsWith("http://") || trimmedInput.startsWith("https://");
    return hasProtocol ? trimmedInput : `https://${trimmedInput}`;
  }

  const cleanedInput = trimmedInput.startsWith("@")
    ? trimmedInput.slice(1)
    : trimmedInput;

  return `${baseUrl}${cleanedInput}`;
};
