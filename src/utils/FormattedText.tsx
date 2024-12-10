// FormattedText.tsx
import React, { useState } from "react";
import { linkify } from "@/utils/linkify"; // importe a função existente

interface FormattedTextProps {
  text: string;
  maxLength?: number;
}

const FormattedText: React.FC<FormattedTextProps> = ({
  text,
  maxLength = 200,
}) => {
  const [expanded, setExpanded] = useState(false);

  if (!text) return null;

  const textLength = text.length;
  const isLongText = textLength > maxLength;

  const visibleLength =
    isLongText && !expanded ? Math.floor(textLength / 2) : textLength;
  const displayText =
    isLongText && !expanded ? text.substring(0, visibleLength) + "..." : text;

  const linkedText = linkify(displayText);

  return (
    <div className="text-black break-words whitespace-pre-wrap">
      {linkedText}
      {isLongText && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="text-blue-600 ml-2 underline"
        >
          Ver mais
        </button>
      )}
    </div>
  );
};

export default FormattedText;
