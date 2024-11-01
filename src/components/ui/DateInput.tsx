import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, parse, isValid } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import MaskedInput from "react-text-mask";

import "react-datepicker/dist/react-datepicker.css";

interface DateInputProps {
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
}

export default function DateInput({
  selectedDate,
  onDateChange,
}: DateInputProps) {
  const [inputValue, setInputValue] = useState(
    selectedDate ? format(selectedDate, "dd/MM/yyyy") : ""
  );
  const [isInputValid, setIsInputValid] = useState(true);

  const handleDateChange = (date: Date | null) => {
    onDateChange(date);
    setInputValue(date ? format(date, "dd/MM/yyyy") : "");
    setIsInputValid(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    const numericValue = value.replace(/\D/g, "");

    if (numericValue.length === 8) {
      const parsedDate = parse(value, "dd/MM/yyyy", new Date());
      if (isValid(parsedDate) && value === format(parsedDate, "dd/MM/yyyy")) {
        onDateChange(parsedDate);
        setIsInputValid(true);
      } else {
        onDateChange(null);
        setIsInputValid(false);
      }
    } else {
      onDateChange(null);
      setIsInputValid(false);
    }
  };

  return (
    <div className="relative">
      <MaskedInput
        mask={[
          /[0-3]/,
          inputValue[0] === "3" ? /[0-1]/ : /\d/,
          "/",
          /[0-1]/,
          inputValue[3] === "1" ? /[0-2]/ : /\d/,
          "/",
          /\d/,
          /\d/,
          /\d/,
          /\d/,
        ]}
        value={inputValue}
        onChange={handleInputChange}
        placeholder="DD/MM/YYYY"
        className={`pr-10 w-full p-3 border rounded-md mt-1 placeholder:text-sm placeholder:text-gray-500 focus-visible:ring-0 focus:ring-0 focus:border-black focus:border-2 ${
          isInputValid ? "border-gray-300" : "border-red-500"
        }`}
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="absolute right-1 top-2 px-3 flex items-center justify-center"
            aria-label="Pick a date"
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="dd/MM/yyyy"
            customInput={<div />}
            inline
          />
        </PopoverContent>
      </Popover>
      {!isInputValid && inputValue && (
        <p className="text-red-500 text-sm mt-1">Data inválida</p>
      )}
    </div>
  );
}
