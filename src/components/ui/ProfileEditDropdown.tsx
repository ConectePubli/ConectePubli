import { useState } from "react";
import { ChevronDown, Circle, CheckCircle } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

interface ProfileEditDropdownProps {
  sectionName: string;
  children: React.ReactNode;
  isComplete: boolean;
}

export default function Component({
  sectionName,
  children,
  isComplete = false,
}: ProfileEditDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className=" px-4">
      <CollapsibleTrigger asChild>
        <Button
          variant="outline"
          className={`flex w-full items-center justify-between p-3 py-6 sm:p-6 ${isOpen ? "rounded-b-none" : "rounded-md"} bg-gray-100`}
        >
          <div className="flex items-center space-x-2 sm:space-x-4">
            {isComplete ? (
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
            ) : (
              <Circle className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
            )}
            <span className="text-base sm:text-lg font-medium truncate">
              {sectionName}
            </span>
          </div>
          <ChevronDown
            className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200 flex-shrink-0 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 px-3 sm:px-6 pb-4 border border-b border-r border-l border-t-0 rounded-b-md">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}
