// components/ComboboxStates.jsx
"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils"; // Certifique-se de que a função `cn` está corretamente implementada
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

interface State {
  name: string;
  abbr: string;
}

interface ComboboxStatesProps {
  states: State[];
  selectedState: string | undefined;
  setSelectedState: (state: string | undefined) => void;
}

export function ComboboxStates({
  states,
  selectedState,
  setSelectedState,
}: ComboboxStatesProps) {
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between truncate h-12"
        >
          {selectedState
            ? states.find((state) => state.name === selectedState)?.name
            : "Selecione um estado..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Pesquisar estado..." />
          <CommandList>
            <CommandEmpty>Nenhum estado encontrado.</CommandEmpty>
            <CommandGroup>
              {states.map((state: State) => (
                <CommandItem
                  key={state.abbr}
                  value={state.name}
                  onSelect={(currentValue: string) => {
                    const selected = states.find(
                      (s) => s.name === currentValue
                    );
                    if (!selected) return;

                    if (selectedState === selected.name) {
                      // Se o estado já está selecionado, desmarque-o
                      setSelectedState(undefined);
                    } else {
                      // Se selecionar um novo estado, atualize
                      setSelectedState(selected.name);
                    }
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedState === state.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {state.name} ({state.abbr})
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
