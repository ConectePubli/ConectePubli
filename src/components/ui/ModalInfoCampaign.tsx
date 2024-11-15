// src/components/ui/modal.tsx

import React from "react";
import ReactDOM from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const ModalInfoCampaign: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
}) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      <div className="relative bg-white w-11/12 max-w-3xl mx-auto p-6 rounded shadow-lg overflow-y-auto max-h-[80vh]">
        <button
          className="absolute top-0 right-0 mt-4 mr-4 text-gray-700 text-2xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>

        <div className="mt-4">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default ModalInfoCampaign;
