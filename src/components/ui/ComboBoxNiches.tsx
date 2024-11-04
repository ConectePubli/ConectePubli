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

interface Niche {
  value: string;
  label: string;
}

type ComboboxNichesProps = {
  niches: Niche[];
  selectedNiches?: string[];
  setSelectedNiches: (selectedNiches: string[] | undefined) => void;
};

export function ComboboxNiches({
  niches,
  selectedNiches,
  setSelectedNiches,
}: ComboboxNichesProps) {
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between truncate h-12 flex items-center overflow-hidden md:max-w-[calc(100vw-350px)]"
        >
          <span className="flex-1 min-w-0 truncate text-ellipsis">
            {selectedNiches && selectedNiches.length > 0
              ? selectedNiches
                  .map((value) => {
                    const niche = niches.find((niche) => niche.value === value);
                    return niche ? niche.label : "";
                  })
                  .filter((label) => label !== "")
                  .join(", ")
              : "Selecione os nichos..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Pesquisar nicho..." />
          <CommandList>
            <CommandEmpty>Nenhum nicho encontrado.</CommandEmpty>
            <CommandGroup>
              {niches.map((niche: Niche) => (
                <CommandItem
                  key={niche.value}
                  value={niche.label}
                  onSelect={(currentLabel: string) => {
                    const selectedNiche = niches.find(
                      (n) => n.label === currentLabel
                    );
                    if (!selectedNiche) return;
                    const currentValue = selectedNiche.value;

                    if (
                      selectedNiches &&
                      selectedNiches.includes(currentValue)
                    ) {
                      setSelectedNiches(
                        selectedNiches.filter(
                          (value: string) => value !== currentValue
                        )
                      );
                    } else {
                      setSelectedNiches([
                        ...(selectedNiches || []),
                        currentValue,
                      ]);
                    }
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      (selectedNiches || []).includes(niche.value)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {niche.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
