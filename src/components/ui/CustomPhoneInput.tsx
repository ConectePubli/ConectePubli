// components/ui/CustomPhoneInput.tsx
"use client";

import React, { forwardRef } from "react";
import { Input } from "@/components/ui/input";

// Definindo as propriedades do CustomPhoneInput
interface CustomPhoneInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const CustomPhoneInput = forwardRef<HTMLInputElement, CustomPhoneInputProps>(
  ({ className, ...props }, ref) => (
    <Input
      {...props}
      ref={ref}
      type="text"
      placeholder="Telefone da empresa"
      className={`w-full p-1 h-5 border-none rounded-md focus:outline-none focus:ring-0 focus-visible:ring-0 focus:ring-[#10438F] ${className}`}
    />
  )
);

CustomPhoneInput.displayName = "CustomPhoneInput";

export default CustomPhoneInput;
