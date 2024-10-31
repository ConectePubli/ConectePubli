"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Country {
  name: string;
  abbr: string;
}

interface ComboboxCountriesProps {
  countries: Country[];
  selectedCountry: string | null;
  setSelectedCountry: React.Dispatch<React.SetStateAction<string | null>>;
}

export function ComboboxCountries({
  countries,
  selectedCountry,
  setSelectedCountry,
}: ComboboxCountriesProps) {
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between truncate h-[48px] items-center mt-[5px] border-gray-300"
        >
          {selectedCountry
            ? countries.find((country) => country.name === selectedCountry)
                ?.name
            : "Selecione um país..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Pesquisar país..." />
          <CommandList>
            <CommandEmpty>Nenhum país encontrado.</CommandEmpty>
            <CommandGroup>
              {countries.map((country: Country) => (
                <CommandItem
                  key={country.abbr}
                  value={country.name}
                  onSelect={(currentValue: string) => {
                    const selected = countries.find(
                      (c) => c.name === currentValue
                    );
                    if (!selected) return;

                    if (selectedCountry === selected.name) {
                      // Se o país já está selecionado, desmarque-o
                      setSelectedCountry(null);
                    } else {
                      // Se selecionar um novo país, atualize
                      setSelectedCountry(selected.name);
                    }
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedCountry === country.name
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {country.name} ({country.abbr})
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
