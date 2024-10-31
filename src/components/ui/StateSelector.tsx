import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const brazilianStates = [
  { name: "Acre", abbr: "AC" },
  { name: "Alagoas", abbr: "AL" },
  { name: "Amapá", abbr: "AP" },
  { name: "Amazonas", abbr: "AM" },
  { name: "Bahia", abbr: "BA" },
  { name: "Ceará", abbr: "CE" },
  { name: "Distrito Federal", abbr: "DF" },
  { name: "Espírito Santo", abbr: "ES" },
  { name: "Goiás", abbr: "GO" },
  { name: "Maranhão", abbr: "MA" },
  { name: "Mato Grosso", abbr: "MT" },
  { name: "Mato Grosso do Sul", abbr: "MS" },
  { name: "Minas Gerais", abbr: "MG" },
  { name: "Pará", abbr: "PA" },
  { name: "Paraíba", abbr: "PB" },
  { name: "Paraná", abbr: "PR" },
  { name: "Pernambuco", abbr: "PE" },
  { name: "Piauí", abbr: "PI" },
  { name: "Rio de Janeiro", abbr: "RJ" },
  { name: "Rio Grande do Norte", abbr: "RN" },
  { name: "Rio Grande do Sul", abbr: "RS" },
  { name: "Rondônia", abbr: "RO" },
  { name: "Roraima", abbr: "RR" },
  { name: "Santa Catarina", abbr: "SC" },
  { name: "São Paulo", abbr: "SP" },
  { name: "Sergipe", abbr: "SE" },
  { name: "Tocantins", abbr: "TO" },
];

/**
 * Props para o componente StateSelector
 * @param {string} selectedState - O estado atualmente selecionado (nome do estado)
 * @param {(state: string) => void} onStateChange - Função callback chamada quando o estado selecionado muda
 */
interface StateSelectorProps {
  selectedState?: string;
  onStateChange: (state: string) => void;
}

export default function StateSelector({
  selectedState = "",
  onStateChange,
}: StateSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(selectedState);

  // Atualiza o valor interno quando a prop selectedState muda
  React.useEffect(() => {
    console.log("selectedState mudou para:", selectedState);
    setValue(selectedState);
  }, [selectedState]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[280px] justify-between"
        >
          {value
            ? brazilianStates.find((state) => state.name === value)?.name ||
              "Selecione um estado..."
            : "Selecione um estado..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0">
        <Command>
          <CommandInput placeholder="Pesquisar estado..." />
          <CommandEmpty>Nenhum estado encontrado.</CommandEmpty>
          <CommandGroup>
            {brazilianStates.map((state) => (
              <CommandItem
                key={state.abbr}
                value={state.name}
                onSelect={(currentValue) => {
                  console.log("Estado selecionado:", currentValue);
                  const newValue = currentValue === value ? "" : currentValue;
                  setValue(newValue);
                  onStateChange(newValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={`mr-2 h-4 w-4 ${
                    value === state.name ? "opacity-100" : "opacity-0"
                  }`}
                />
                {state.name} ({state.abbr})
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
