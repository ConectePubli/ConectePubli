export const linkify = (text: string) => {
  // Regex para detectar URLs
  // Essa regex detecta links com ou sem http(s) e também domínios do tipo www.
  const urlRegex = /((https?:\/\/)?(www\.)?([\w-]+\.)+[a-zA-Z]{2,}([/\w-./?%&=]*)?)/gi;

  const parts = text.split(' ');

  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      const url = part.startsWith('http') ? part : `http://${part}`;
      return (
        <a
          key={index}
          href={url}  
          target="_blank"
          rel="noopener noreferrer"
          className="underline cursor-pointer"
        >
          {part}
        </a>
      );
    } else {
      return <span key={index}>{part} </span>;
    }
  });
}
